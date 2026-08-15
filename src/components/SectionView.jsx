import React, { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSection } from '../content/index.js'
import { useBackend } from '../lib/backend.jsx'

function fmtMins(m) {
  if (!m) return ''
  if (m < 60) return `${m}m`
  return `${Math.round((m / 60) * 10) / 10}h`
}

export function SectionView() {
  const { sectionId } = useParams()
  const section = getSection(sectionId)
  const { online, isDone } = useBackend()

  useEffect(() => { window.scrollTo(0, 0) }, [sectionId])

  if (!section) return <Navigate to="/" replace />

  const total = section.topics.length
  const done = section.topics.filter((t) => isDone(t.id)).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const mins = section.topics.reduce((s, t) => s + (t.mins || 0), 0)

  return (
    <div className="page">
      <header className="topic-head">
        <nav className="crumbs">
          <Link to="/">Home</Link><span>›</span><span>{section.name}</span>
        </nav>
        <h1>{section.icon} {section.name}</h1>
        <p className="lede">{section.blurb}</p>
        <div className="chips">
          <span className="chip week">{section.weeks}</span>
          <span className="chip">{total} topics</span>
          <span className="chip time">≈ {Math.round(mins / 60)} hrs</span>
          {online && <span className="chip core">{done}/{total} done</span>}
        </div>
        {online && <div className="bar"><i style={{ width: `${pct}%` }} /></div>}
      </header>

      <div style={{ marginTop: 26 }}>
        <div className="topic-rows">
          {section.topics.map((t, i) => {
            const complete = isDone(t.id)
            return (
              <Link
                className={`trow ${complete ? 'done' : ''}`}
                to={`/t/${t.id}`}
                key={t.id}
              >
                <span className="trow-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="trow-body">
                  <span className="trow-name">{t.name}</span>
                  <span className="trow-sum">{t.summary}</span>
                </span>
                <span className="trow-meta">
                  {t.tag === 'core' && <span style={{ color: 'var(--ok)' }}>core</span>}
                  <span>W{t.week}</span>
                  <span>{fmtMins(t.mins)}</span>
                  {online && <span className="tick">{complete ? '✓' : '○'}</span>}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SectionView
