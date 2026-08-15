import React from 'react'
import { Link } from 'react-router-dom'
import { sections, allTopics, totalTopics, totalMinutes } from '../content/index.js'
import { useBackend } from '../lib/backend.jsx'

export function Home() {
  const { online, state } = useBackend()

  const doneIds = new Set(
    Object.values(state).filter((r) => r?.completed).map((r) => r._id)
  )
  const done = allTopics.filter((t) => doneIds.has(t.id)).length
  const pct = totalTopics ? Math.round((done / totalTopics) * 100) : 0
  const hours = Math.round(totalMinutes / 60)

  const nextUp = allTopics.find((t) => !doneIds.has(t.id))

  return (
    <div className="page wide">
      <header className="hero">
        <div className="eyebrow">26-week block · backend interview preparation</div>
        <h1>Everything you need to learn, in the order you need it</h1>
        <p className="lede">
          Eleven sections, {totalTopics} topics, roughly {hours} hours of material.
          Ordered by dependency rather than importance — complexity before DSA, low-level
          design before system design. Work top to bottom.
        </p>

        <dl className="stats">
          <div className="stat">
            <dt className="stat-k">Topics</dt>
            <dd className="stat-v">{totalTopics}</dd>
          </div>
          <div className="stat">
            <dt className="stat-k">Est. study</dt>
            <dd className="stat-v">{hours}<small> hrs</small></dd>
          </div>
          <div className="stat">
            <dt className="stat-k">Completed</dt>
            <dd className="stat-v">{online ? done : '—'}</dd>
          </div>
          <div className="stat">
            <dt className="stat-k">Progress</dt>
            <dd className="stat-v">{online ? `${pct}%` : '—'}</dd>
          </div>
          <div className="stat">
            <dt className="stat-k">Weekly load</dt>
            <dd className="stat-v">14<small> hrs</small></dd>
          </div>
        </dl>

        {online && (
          <div className="bar" aria-label={`${pct} percent complete`}>
            <i style={{ width: `${pct}%` }} />
          </div>
        )}
      </header>

      {online && nextUp && (
        <section className="sec-block" style={{ marginTop: 28 }}>
          <Link className="card" to={`/t/${nextUp.id}`} style={{ maxWidth: 460 }}>
            <div className="card-top">
              <div className="card-ico">▶</div>
              <div>
                <div className="card-name">Pick up where you left off</div>
                <div className="small faint">{nextUp.sectionName}</div>
              </div>
            </div>
            <div className="card-desc"><strong>{nextUp.name}</strong> — {nextUp.summary}</div>
          </Link>
        </section>
      )}

      {!online && (
        <div className="callout warn" style={{ marginTop: 26 }}>
          <span className="lbl">Read-only mode</span>
          <p>
            The local backend is not connected, so completion ticks, notes and the code
            scratchpad are hidden. <strong>All study content is fully available</strong> — this
            is the expected state on your phone or from the deployed link.
          </p>
        </div>
      )}

      <section style={{ marginTop: 34 }}>
        <h2 style={{ marginBottom: 16 }}>Sections</h2>
        <div className="cards">
          {sections.map((s) => {
            const sTotal = s.topics.length
            const sDone = s.topics.filter((t) => doneIds.has(t.id)).length
            const sPct = sTotal ? Math.round((sDone / sTotal) * 100) : 0
            return (
              <Link className="card" to={`/s/${s.id}`} key={s.id}>
                <div className="card-top">
                  <div className="card-ico">{s.icon}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="card-name">{s.name}</div>
                    <div className="small faint">{s.weeks}</div>
                  </div>
                </div>
                <div className="card-desc">{s.blurb}</div>
                {online && (
                  <div className="bar thin"><i style={{ width: `${sPct}%` }} /></div>
                )}
                <div className="card-foot">
                  <span>{sTotal} topics</span>
                  {online && <span>· {sDone} done</span>}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ marginBottom: 12 }}>Not sure where to begin?</h2>
        <div className="callout tip">
          <span className="lbl">Start here</span>
          <p>
            Read <Link to="/t/start-method">The method that makes it stick</Link>, then do the whole
            of <Link to="/s/complexity">Complexity &amp; Big-O</Link> before touching a single DSA
            problem. It gets its own section because it looks like mathematics and is the most
            common place people stall — done in this order it takes about a week, and everything
            downstream unblocks.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
