import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

/**
 * Backend is optional by design.
 *
 * The frontend is deployed to GitHub Pages; the API runs on the user's own
 * machine. When the API is unreachable the whole app stays usable in
 * READ-ONLY mode: every piece of study content renders, but nothing that
 * writes state (completion ticks, notes, code scratchpads) is offered.
 */

const DEFAULT_API = 'http://localhost:4000'
const LS_KEY = 'prepatlas.apiBase'
const PING_MS = 20000

const Ctx = createContext(null)

export function useBackend() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBackend must be used inside <BackendProvider>')
  return ctx
}

export function BackendProvider({ children }) {
  const [apiBase, setApiBaseState] = useState(
    () => localStorage.getItem(LS_KEY) || DEFAULT_API
  )
  const [status, setStatus] = useState('checking') // checking | online | offline
  const [state, setState] = useState({})           // topicId -> record
  const [loaded, setLoaded] = useState(false)
  const inflight = useRef(null)

  const setApiBase = useCallback((next) => {
    const clean = String(next || '').trim().replace(/\/+$/, '')
    localStorage.setItem(LS_KEY, clean)
    setApiBaseState(clean)
    setStatus('checking')
  }, [])

  const request = useCallback(async (path, opts = {}, timeoutMs = 4000) => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    try {
      const res = await fetch(apiBase + path, {
        ...opts,
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } finally {
      clearTimeout(timer)
    }
  }, [apiBase])

  const refresh = useCallback(async () => {
    if (inflight.current) return inflight.current
    const p = (async () => {
      try {
        await request('/api/health', {}, 2500)
        const data = await request('/api/state')
        const map = {}
        for (const row of data.items || []) map[row._id] = row
        setState(map)
        setStatus('online')
      } catch {
        setStatus('offline')
      } finally {
        setLoaded(true)
        inflight.current = null
      }
    })()
    inflight.current = p
    return p
  }, [request])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, PING_MS)
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus) }
  }, [refresh])

  const online = status === 'online'

  /** Merge a partial patch into one topic's record. */
  const save = useCallback(async (topicId, patch) => {
    if (!online) return { ok: false, reason: 'offline' }
    // optimistic
    setState((s) => ({ ...s, [topicId]: { ...(s[topicId] || { _id: topicId }), ...patch } }))
    try {
      const saved = await request(`/api/state/${encodeURIComponent(topicId)}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      }, 6000)
      setState((s) => ({ ...s, [topicId]: saved.item }))
      return { ok: true }
    } catch (e) {
      setStatus('offline')
      return { ok: false, reason: String(e.message || e) }
    }
  }, [online, request])

  const toggleComplete = useCallback(async (topicId) => {
    const cur = state[topicId]?.completed
    return save(topicId, {
      completed: !cur,
      completedAt: !cur ? new Date().toISOString() : null,
    })
  }, [state, save])

  const get = useCallback((topicId) => state[topicId] || null, [state])
  const isDone = useCallback((topicId) => Boolean(state[topicId]?.completed), [state])

  const reviewQueue = useCallback(async () => {
    if (!online) return []
    try {
      const d = await request('/api/review-queue', {}, 6000)
      return d.items || []
    } catch { return [] }
  }, [online, request])

  const value = {
    apiBase, setApiBase, defaultApi: DEFAULT_API,
    status, online, loaded, state,
    refresh, save, toggleComplete, get, isDone, reviewQueue,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
