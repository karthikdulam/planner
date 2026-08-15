import { start } from './start.js'
import { complexity } from './complexity.js'
import { dsa } from './dsa.js'
import { java } from './java.js'
import { javaversions } from './javaversions.js'
import { spring } from './spring.js'
import { database } from './database.js'
import { lld } from './lld.js'
import { hld } from './hld.js'
import { messaging } from './messaging.js'
import { cloud } from './cloud.js'
import { frontend } from './frontend.js'
import { interview } from './interview.js'

/** Ordered by dependency, not by importance. Complexity before DSA, LLD before HLD. */
export const sections = [
  start,
  complexity,
  dsa,
  java,
  javaversions,
  spring,
  database,
  lld,
  hld,
  messaging,
  cloud,
  frontend,
  interview,
]

export const allTopics = sections.flatMap((s) =>
  s.topics.map((t) => ({ ...t, sectionId: s.id, sectionName: s.name, sectionIcon: s.icon }))
)

const bySectionId = new Map(sections.map((s) => [s.id, s]))
const byTopicId = new Map(allTopics.map((t) => [t.id, t]))

export const getSection = (id) => bySectionId.get(id) || null
export const getTopic = (id) => byTopicId.get(id) || null

export const totalTopics = allTopics.length
export const totalMinutes = allTopics.reduce((sum, t) => sum + (t.mins || 0), 0)

/** Previous / next across the whole ordered curriculum, for the topic footer nav. */
export function neighbours(topicId) {
  const i = allTopics.findIndex((t) => t.id === topicId)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? allTopics[i - 1] : null,
    next: i < allTopics.length - 1 ? allTopics[i + 1] : null,
  }
}

/**
 * Plain substring search over titles, summaries and block text.
 * No index, no dependency — the corpus is small enough that this is instant.
 */
export function searchTopics(query) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  const results = []
  for (const t of allTopics) {
    let score = 0
    if (t.name.toLowerCase().includes(q)) score += 100
    if (t.sectionName.toLowerCase().includes(q)) score += 20
    if ((t.summary || '').toLowerCase().includes(q)) score += 40

    if (score === 0) {
      // fall back to scanning block bodies
      const hay = JSON.stringify(t.blocks || '').toLowerCase()
      if (hay.includes(q)) score += 10
    }
    if (score > 0) results.push({ topic: t, score })
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 40).map((r) => r.topic)
}
