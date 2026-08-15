import React, { useEffect, useRef, useState } from 'react'
import { useBackend } from '../lib/backend.jsx'
import { SUPPORTED_LANGS } from '../lib/highlight.js'

const AUTOSAVE_MS = 1200

/**
 * Everything on this panel writes to the local backend. When the backend is
 * unreachable the panel collapses to an explanation — content stays readable,
 * nothing pretends to save.
 */
export function Workspace({ topicId, topicName }) {
  const { online, get, save, toggleComplete, apiBase, setApiBase, defaultApi, refresh } = useBackend()
  const record = get(topicId)

  const [note, setNote] = useState('')
  const [code, setCode] = useState('')
  const [lang, setLang] = useState('java')
  const [flagged, setFlagged] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [apiDraft, setApiDraft] = useState(apiBase)

  const hydratedFor = useRef(null)
  const timer = useRef(null)

  // Load the record into local state once per topic (and once it arrives).
  useEffect(() => {
    if (hydratedFor.current === topicId && !record) return
    if (hydratedFor.current !== topicId || (record && !dirty)) {
      setNote(record?.note ?? '')
      setCode(record?.code ?? '')
      setLang(record?.lang ?? 'java')
      setFlagged(Boolean(record?.flaggedForReview))
      setDirty(false)
      hydratedFor.current = topicId
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, record?._id, record?.updatedAt])

  // Debounced autosave
  useEffect(() => {
    if (!dirty || !online) return
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const res = await save(topicId, { note, code, lang, flaggedForReview: flagged })
      if (res.ok) {
        setDirty(false)
        setSavedAt(new Date())
      }
    }, AUTOSAVE_MS)
    return () => clearTimeout(timer.current)
  }, [note, code, lang, flagged, dirty, online, save, topicId])

  const edit = (setter) => (value) => { setter(value); setDirty(true) }

  if (!online) {
    return (
      <section className="ws">
        <div className="ws-head"><span className="ws-title">Your workspace</span></div>
        <div className="ws-locked">
          <span className="lbl">Read-only — backend not connected</span>
          <p>
            Progress ticks, notes and the code scratchpad need your local API running.
            Start it with <code className="ic">npm run server</code> in the project folder
            (it needs MongoDB on <code className="ic">localhost:27017</code>).
          </p>
          <p className="small faint">
            Everything else on this page works exactly as normal — all the study content is bundled
            into the frontend, so the deployed site is fully readable on your phone without any backend.
          </p>
          <div className="row">
            <button className="btn sm" onClick={() => setShowSettings((s) => !s)}>
              {showSettings ? 'Hide' : 'Change API address'}
            </button>
            <button className="btn sm" onClick={refresh}>Retry connection</button>
          </div>
          {showSettings && (
            <div className="row">
              <input
                className="sb-search"
                style={{ maxWidth: 320 }}
                value={apiDraft}
                onChange={(e) => setApiDraft(e.target.value)}
                placeholder={defaultApi}
              />
              <button className="btn sm primary" onClick={() => setApiBase(apiDraft)}>Save</button>
            </div>
          )}
        </div>
      </section>
    )
  }

  const done = Boolean(record?.completed)

  return (
    <section className="ws">
      <div className={`complete-bar ${done ? 'done' : ''}`}>
        <button
          className="cbx"
          onClick={() => toggleComplete(topicId)}
          aria-pressed={done}
          aria-label={done ? 'Mark as not complete' : 'Mark as complete'}
        >
          ✓
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600 }}>
            {done ? 'Completed' : 'Mark this topic complete'}
          </div>
          {done && record?.completedAt && (
            <div className="small faint">
              {new Date(record.completedAt).toLocaleDateString(undefined, {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>

      <div className="ws-head">
        <span className="ws-title">Your workspace</span>
        <span className="spacer" />
        {dirty ? (
          <span className="dirty-tag">saving…</span>
        ) : savedAt ? (
          <span className="saved-tag">saved {savedAt.toLocaleTimeString()}</span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-lbl" htmlFor={`note-${topicId}`}>
          Notes, doubts &amp; your pattern journal page
        </label>
        <textarea
          id={`note-${topicId}`}
          value={note}
          onChange={(e) => edit(setNote)(e.target.value)}
          placeholder={`What tips me off that it's this pattern?\nThe skeleton code.\nComplexity, and why.\n\nAnything you're still unsure about — ask Claude to read your notes and answer them.`}
        />
      </div>

      <div className="field">
        <label className="field-lbl" htmlFor={`code-${topicId}`}>
          Code scratchpad
          <select value={lang} onChange={(e) => edit(setLang)(e.target.value)}>
            {SUPPORTED_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'none', letterSpacing: 0 }}>
            <input
              type="checkbox"
              checked={flagged}
              onChange={(e) => edit(setFlagged)(e.target.checked)}
            />
            <span style={{ fontSize: 12 }}>flag for review</span>
          </label>
        </label>
        <textarea
          id={`code-${topicId}`}
          className="mono"
          value={code}
          onChange={(e) => edit(setCode)(e.target.value)}
          spellCheck={false}
          placeholder={`// Write your own solution here — AI off.\n// Tick "flag for review", then ask Claude to check your review queue.\n\n// time  = O(?) because\n// space = O(?) because`}
        />
        <p className="small faint">
          Flagged snippets appear in the <strong>Review queue</strong>. Ask Claude
          &ldquo;check my review queue&rdquo; and it can read every flagged snippet at once.
        </p>
      </div>
    </section>
  )
}

export default Workspace
