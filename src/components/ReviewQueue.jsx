import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBackend } from '../lib/backend.jsx'
import { getTopic } from '../content/index.js'
import CodeBlock from './CodeBlock.jsx'

export function ReviewQueue() {
  const { online, reviewQueue, apiBase } = useBackend()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    reviewQueue().then((rows) => {
      if (!cancelled) { setItems(rows); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [reviewQueue, online])

  return (
    <div className="page">
      <header className="topic-head">
        <nav className="crumbs"><Link to="/">Home</Link><span>›</span><span>Review queue</span></nav>
        <h1>Review queue</h1>
        <p className="lede">
          Everything you flagged for review. Ask Claude to <strong>&ldquo;check my review
          queue&rdquo;</strong> and it can read all of these at once and tell you what is wrong
          with each.
        </p>
      </header>

      {!online && (
        <div className="callout warn" style={{ marginTop: 22 }}>
          <span className="lbl">Backend not connected</span>
          <p>
            The review queue lives in your local database. Start the API with
            <code className="ic"> npm run server</code> to see it.
          </p>
        </div>
      )}

      {online && loading && <p className="sr-empty">Loading…</p>}

      {online && !loading && items.length === 0 && (
        <div className="callout tip" style={{ marginTop: 22 }}>
          <span className="lbl">Nothing flagged yet</span>
          <p>
            Write a solution in any topic&rsquo;s code scratchpad, tick <strong>flag for
            review</strong>, and it appears here.
          </p>
        </div>
      )}

      {online && !loading && items.length > 0 && (
        <>
          <div className="callout" style={{ marginTop: 22, marginBottom: 20 }}>
            <span className="lbl">For Claude</span>
            <p>
              Fetch everything at once with
              <code className="ic"> curl {apiBase}/api/review-queue</code>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {items.map((item) => {
              const topic = getTopic(item._id)
              return (
                <div className="rq-item" key={item._id}>
                  <div className="rq-head">
                    <Link to={`/t/${item._id}`} style={{ fontWeight: 600 }}>
                      {topic?.name || item._id}
                    </Link>
                    <span className="spacer" />
                    <span className="chip">{item.lang || 'java'}</span>
                    {item.updatedAt && (
                      <span className="small faint">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <div style={{ padding: '12px 15px', borderBottom: '1px solid var(--line)' }}>
                      <div className="field-lbl" style={{ marginBottom: 6 }}>Your note</div>
                      <p className="small muted" style={{ whiteSpace: 'pre-wrap' }}>{item.note}</p>
                    </div>
                  )}
                  {item.code && (
                    <CodeBlock lang={item.lang || 'java'} code={item.code} caption="Your solution" />
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewQueue
