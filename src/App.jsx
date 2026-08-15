import React, { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Link, NavLink, useLocation, Navigate } from 'react-router-dom'
import { sections, allTopics, searchTopics } from './content/index.js'
import { useBackend } from './lib/backend.jsx'
import Home from './components/Home.jsx'
import SectionView from './components/SectionView.jsx'
import TopicView from './components/TopicView.jsx'
import TimelineView from './components/TimelineView.jsx'
import ReviewQueue from './components/ReviewQueue.jsx'

/* ------------------------------------------------------------------ */

function ConnectionBadge() {
  const { status, online } = useBackend()
  const label =
    status === 'checking' ? 'connecting…' : online ? 'backend live' : 'read-only'
  return (
    <span className={`conn ${online ? 'on' : status === 'offline' ? 'off' : ''}`}>
      <span className="dot" />
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */

function Sidebar({ open, onNavigate }) {
  const { online, isDone, state } = useBackend()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(() => new Set(['start', 'complexity']))

  // Auto-open the section containing the current topic
  useEffect(() => {
    const m = location.pathname.match(/^\/t\/(.+)$/)
    if (m) {
      const topic = allTopics.find((t) => t.id === m[1])
      if (topic) setExpanded((s) => new Set(s).add(topic.sectionId))
    }
    const sm = location.pathname.match(/^\/s\/(.+)$/)
    if (sm) setExpanded((s) => new Set(s).add(sm[1]))
  }, [location.pathname])

  const results = useMemo(() => (query.trim().length >= 2 ? searchTopics(query) : null), [query])

  const doneCount = Object.values(state).filter((r) => r?.completed).length
  const pct = allTopics.length ? Math.round((doneCount / allTopics.length) * 100) : 0

  const toggle = (id) =>
    setExpanded((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sb-head">
        <Link to="/" className="brand" onClick={onNavigate} style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="brand-mark">PA</span>
          <span>
            <span className="brand-name">Prep Atlas</span>
            <br />
            <span className="brand-sub">26-week block</span>
          </span>
        </Link>
        <input
          className="sb-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics…"
          aria-label="Search topics"
        />
      </div>

      <nav className="sb-scroll">
        {results ? (
          <div className="sb-items" style={{ paddingLeft: 0 }}>
            {results.length === 0 && <p className="small faint" style={{ padding: 10 }}>No matches.</p>}
            {results.map((t) => (
              <NavLink
                key={t.id}
                to={`/t/${t.id}`}
                className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
                onClick={() => { setQuery(''); onNavigate?.() }}
              >
                <span className="sb-item-label">
                  {t.name}
                  <br />
                  <span className="small faint">{t.sectionName}</span>
                </span>
              </NavLink>
            ))}
          </div>
        ) : (
          <>
            <NavLink
              to="/timeline"
              className={({ isActive }) => `sb-group-btn ${isActive ? 'on' : ''}`}
              onClick={onNavigate}
              style={{ marginBottom: 4 }}
            >
              <span className="sb-caret" />
              <span className="sb-ico">◷</span>
              26-week timeline
            </NavLink>

            <NavLink
              to="/review"
              className={({ isActive }) => `sb-group-btn ${isActive ? 'on' : ''}`}
              onClick={onNavigate}
              style={{ marginBottom: 10 }}
            >
              <span className="sb-caret" />
              <span className="sb-ico">⚑</span>
              Review queue
            </NavLink>

            {sections.map((s) => {
              const isOpen = expanded.has(s.id)
              const sDone = s.topics.filter((t) => isDone(t.id)).length
              const allDone = online && sDone === s.topics.length
              return (
                <div className="sb-group" key={s.id}>
                  <button
                    className={`sb-group-btn ${isOpen ? 'open on' : ''}`}
                    onClick={() => toggle(s.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="sb-caret">▶</span>
                    <span className="sb-ico">{s.icon}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>{s.name}</span>
                    <span className={`sb-count ${allDone ? 'done' : ''}`}>
                      {online ? `${sDone}/${s.topics.length}` : s.topics.length}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="sb-items">
                      <NavLink
                        to={`/s/${s.id}`}
                        className="sb-item"
                        onClick={onNavigate}
                        style={{ fontStyle: 'italic' }}
                      >
                        <span className="tick">·</span>
                        <span className="sb-item-label">Section overview</span>
                      </NavLink>
                      {s.topics.map((t) => {
                        const complete = isDone(t.id)
                        return (
                          <NavLink
                            key={t.id}
                            to={`/t/${t.id}`}
                            className={({ isActive }) =>
                              `sb-item ${isActive ? 'active' : ''} ${complete ? 'done' : ''}`
                            }
                            onClick={onNavigate}
                          >
                            <span className="tick">{online ? (complete ? '✓' : '○') : '·'}</span>
                            <span className="sb-item-label">{t.name}</span>
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </nav>

      <div className="sb-foot">
        {online && (
          <>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="small faint">Progress</span>
              <span className="pct">{doneCount}/{allTopics.length} · {pct}%</span>
            </div>
            <div className="bar thin"><i style={{ width: `${pct}%` }} /></div>
          </>
        )}
        <ConnectionBadge />
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------ */

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setNavOpen(false) }, [location.pathname])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  return (
    <div className="app">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      <div
        className={`scrim ${navOpen ? 'show' : ''}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />

      <main className="main">
        <div className="topbar">
          <button
            className="hamburger"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
          >
            ☰
          </button>
          <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0 }}>
            <span className="brand-mark">PA</span>
            <span className="brand-name">Prep Atlas</span>
          </Link>
          <ConnectionBadge />
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<TimelineView />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/s/:sectionId" element={<SectionView />} />
          <Route path="/t/:topicId" element={<TopicView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
