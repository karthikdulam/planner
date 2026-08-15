import React, { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getTopic, neighbours } from '../content/index.js'
import Block from './Block.jsx'
import Workspace from './Workspace.jsx'

function fmtMins(m) {
  if (!m) return null
  if (m < 60) return `${m} min`
  const h = Math.round((m / 60) * 10) / 10
  return `${h} hr${h === 1 ? '' : 's'}`
}

export function TopicView() {
  const { topicId } = useParams()
  const topic = getTopic(topicId)

  useEffect(() => { window.scrollTo(0, 0) }, [topicId])

  if (!topic) return <Navigate to="/" replace />

  const { prev, next } = neighbours(topicId)

  return (
    <div className="page">
      <header className="topic-head">
        <nav className="crumbs">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to={`/s/${topic.sectionId}`}>{topic.sectionName}</Link>
        </nav>

        <h1>{topic.name}</h1>
        {topic.summary && <p className="lede">{topic.summary}</p>}

        <div className="chips">
          {topic.week != null && <span className="chip week">Week {topic.week}</span>}
          {topic.mins && <span className="chip time">{fmtMins(topic.mins)}</span>}
          {topic.tag === 'core' && <span className="chip core">Core</span>}
          <span className="chip">{topic.sectionIcon} {topic.sectionName}</span>
        </div>
      </header>

      <div className="blocks">
        {(topic.blocks || []).map((b, i) => <Block block={b} key={i} />)}
      </div>

      <Workspace topicId={topic.id} topicName={topic.name} />

      <nav className="ws" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="row">
          {prev ? (
            <Link className="btn" to={`/t/${prev.id}`}>← {prev.name}</Link>
          ) : <span />}
          <span className="spacer" />
          {next && <Link className="btn primary" to={`/t/${next.id}`}>{next.name} →</Link>}
        </div>
      </nav>
    </div>
  )
}

export default TopicView
