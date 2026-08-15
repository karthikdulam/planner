import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { phases, rhythm, checkpoints, quitModes, laws, economics, economicsNote } from '../content/timeline.js'
import { allTopics } from '../content/index.js'
import Inline from './Inline.jsx'

/**
 * The per-week topic list is derived from the content itself, so the schedule
 * can never drift out of sync with what is actually written.
 */
function useSchedule() {
  return useMemo(() => {
    const map = new Map()
    for (const t of allTopics) {
      if (!map.has(t.week)) map.set(t.week, [])
      map.get(t.week).push(t)
    }
    return map
  }, [])
}

function WeekTopics({ topics }) {
  if (!topics || topics.length === 0) return null
  const hours = Math.round((topics.reduce((s, t) => s + t.mins, 0) / 60) * 10) / 10
  return (
    <div className="wk-topics">
      <span className="wk-topics-lbl">{topics.length} topics · ≈{hours}h</span>
      {topics.map((t) => (
        <Link className="wk-chip" to={`/t/${t.id}`} key={t.id} title={t.sectionName}>
          {t.name}
        </Link>
      ))}
    </div>
  )
}

export function TimelineView() {
  const schedule = useSchedule()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="page wide">
      <header className="topic-head">
        <nav className="crumbs"><Link to="/">Home</Link><span>›</span><span>Timeline</span></nav>
        <h1>The 26-week block</h1>
        <p className="lede">
          Three lanes run in parallel — problems in protected morning hours, depth in
          low-energy evening reading, design and voice at weekends. Parallel rather than
          sequential, so a bad week costs you a change of lane instead of a stop.
        </p>
        <div className="chips">
          <span className="chip week">26 weeks</span>
          <span className="chip time">14 hrs/week</span>
          <span className="chip core">6 new problems + 3 re-solves weekly</span>
        </div>
      </header>

      <div className="callout tip" style={{ marginTop: 24 }}>
        <span className="lbl">Mastery-gated, not calendar-gated</span>
        <p>
          The gate for leaving a topic is <strong>three unseen problems in it, solved alone, in
          time</strong> — not the date. If a week takes eleven days, take eleven days. There is
          slack built in deliberately. <strong>Falling behind the calendar is allowed. Stopping is not.</strong>
        </p>
      </div>

      {phases.map((phase) => (
        <section className="phase" key={phase.no}>
          <div className="phase-head">
            <span className="phase-no">{phase.no}</span>
            <h2>{phase.name}</h2>
            <p className="phase-goal">{phase.goal}</p>
          </div>

          {phase.weeks.map((w) => (
            <div className="wk" key={w.n}>
              <div className="wk-no">WEEK {String(w.n).padStart(2, '0')}</div>
              <div className="wk-lane">
                <span className="wk-tag">Problems</span>
                <p><Inline text={w.dsa} /></p>
              </div>
              <div className="wk-lane">
                <span className="wk-tag">Depth</span>
                <p><Inline text={w.depth} /></p>
              </div>
              <div className="wk-lane">
                <span className="wk-tag">Design &amp; voice</span>
                <p><Inline text={w.design} /></p>
              </div>
              {w.mile && (
                <div className="wk-mile">
                  <span className="mk">{w.mile.tag}</span>
                  <span><Inline text={w.mile.text} /></span>
                </div>
              )}
              <WeekTopics topics={schedule.get(w.n)} />
            </div>
          ))}
        </section>
      ))}

      <section style={{ marginTop: 50 }}>
        <h2 style={{ marginBottom: 14 }}>The week, concretely</h2>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th scope="col">When</th><th scope="col">Hours</th><th scope="col">What</th></tr>
            </thead>
            <tbody>
              {rhythm.map((r) => (
                <tr key={r.when}>
                  <td style={{ whiteSpace: 'nowrap' }}><strong>{r.when}</strong></td>
                  <td className="faint" style={{ whiteSpace: 'nowrap' }}>{r.hours}</td>
                  <td>{r.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ marginBottom: 14 }}>Checkpoints</h2>
        <div className="topic-rows">
          {checkpoints.map((c) => (
            <div className="trow" key={c.week}>
              <span className="trow-n" style={{ color: 'var(--warn)', width: 66, flex: '0 0 66px' }}>{c.week}</span>
              <span className="trow-body"><span className="trow-name" style={{ fontWeight: 450 }}>{c.what}</span></span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ marginBottom: 6 }}>When you want to stop</h2>
        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 16 }}>
          You will lose interest — around week 9 or 10, reliably. Planning for it is not
          pessimism. &ldquo;Losing interest&rdquo; is five different failures wearing the same
          clothes, and applying the wrong fix makes it worse. Work out which one you are in.
        </p>
        <div className="cards">
          {quitModes.map((m) => (
            <div className="card" key={m.name} style={{ cursor: 'default' }}>
              <div className="small faint" style={{ fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 10 }}>
                {m.name}
              </div>
              <div style={{ color: 'var(--danger)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.35 }}>
                {m.says}
              </div>
              <div className="card-desc"><Inline text={m.fix} /></div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 30, marginBottom: 10 }}>Five rules that hold regardless</h3>
        <div className="block">
          <ol>{laws.map((l, i) => <li key={i}><Inline text={l} /></li>)}</ol>
        </div>
      </section>

      <section style={{ marginTop: 44, marginBottom: 40 }}>
        <h2 style={{ marginBottom: 6 }}>Why this is worth 340 hours</h2>
        <p className="muted" style={{ maxWidth: '68ch', marginBottom: 14 }}>
          Ratios rather than figures, so they hold whatever you currently earn.
        </p>
        <div className="tbl-wrap">
          <table>
            <tbody>
              {economics.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td style={{ whiteSpace: 'nowrap' }}><Inline text={v} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ marginTop: 12, maxWidth: '68ch' }}>
          {economicsNote}
        </p>
      </section>
    </div>
  )
}

export default TimelineView
