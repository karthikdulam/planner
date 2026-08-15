/**
 * Tiny dependency-free syntax highlighter.
 * Good enough for Java / SQL / JS / YAML / bash snippets in a study app.
 * Returns an array of {t: tokenClass, v: value} so React can render it safely
 * (no dangerouslySetInnerHTML anywhere).
 */

const KEYWORDS = {
  java: `abstract assert boolean break byte case catch char class const continue default do double
    else enum extends final finally float for goto if implements import instanceof int interface long
    native new package private protected public return short static strictfp super switch synchronized
    this throw throws transient try void volatile while var record sealed permits yield true false null`,
  sql: `select from where group by having order limit offset insert into values update set delete
    create table alter drop index view join inner left right full outer on as distinct union all
    and or not null is in between like exists case when then else end with recursive over partition
    rows range preceding following current row primary key foreign references unique constraint
    default check begin commit rollback transaction isolation level explain analyze asc desc count
    sum avg min max coalesce cast if exists truncate`,
  javascript: `await async break case catch class const continue debugger default delete do else export
    extends finally for function if import in instanceof let new of return static super switch this
    throw try typeof var void while with yield true false null undefined`,
  bash: `if then else elif fi for while do done case esac function return export local echo cd exit`,
  yaml: `true false null yes no on off`,
  json: `true false null`,
}

const TYPE_RE = /\b[A-Z][A-Za-z0-9_]*\b/
const NUM_RE = /\b(?:0[xX][0-9a-fA-F_]+|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?[LlFfDd]?)\b/
const ANN_RE = /@[A-Za-z_][A-Za-z0-9_]*/
const PUNC_RE = /[{}()[\];,.<>=+\-*/%!&|?:~^]/

function buildKeywordRe(lang) {
  const raw = KEYWORDS[lang]
  if (!raw) return null
  const words = raw.trim().split(/\s+/).filter(Boolean)
  const flags = lang === 'sql' ? 'i' : ''
  return new RegExp(`\\b(?:${words.join('|')})\\b`, flags)
}

function commentRe(lang) {
  if (lang === 'sql') return /--[^\n]*|\/\*[\s\S]*?\*\//
  if (lang === 'bash' || lang === 'yaml' || lang === 'properties') return /#[^\n]*/
  return /\/\/[^\n]*|\/\*[\s\S]*?\*\//
}

function stringRe(lang) {
  if (lang === 'sql') return /'(?:[^'\\]|\\.|'')*'|"(?:[^"\\]|\\.)*"/
  return /"""[\s\S]*?"""|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/
}

const cache = new Map()

function rulesFor(lang) {
  if (cache.has(lang)) return cache.get(lang)
  const kw = buildKeywordRe(lang)
  const rules = [
    ['tok-com', commentRe(lang)],
    ['tok-str', stringRe(lang)],
    ['tok-ann', ANN_RE],
    ['tok-num', NUM_RE],
    kw ? ['tok-key', kw] : null,
    ['tok-type', TYPE_RE],
    ['tok-punc', PUNC_RE],
  ].filter(Boolean)

  // Combine into one master regex with a capture group per rule.
  const source = rules.map(([, re]) => `(${re.source})`).join('|')
  const anyCaseInsensitive = rules.some(([, re]) => re.flags.includes('i'))
  const master = new RegExp(source, anyCaseInsensitive ? 'gi' : 'g')
  const out = { classes: rules.map(([c]) => c), master }
  cache.set(lang, out)
  return out
}

/**
 * @param {string} code
 * @param {string} lang
 * @returns {Array<{t: string|null, v: string}>}
 */
export function tokenize(code, lang = 'java') {
  const src = String(code ?? '')
  const known = Object.prototype.hasOwnProperty.call(KEYWORDS, lang)
  const key = known ? lang : 'java'
  if (lang === 'text' || lang === 'plain') return [{ t: null, v: src }]

  const { classes, master } = rulesFor(key)
  master.lastIndex = 0

  const out = []
  let last = 0
  let m

  while ((m = master.exec(src)) !== null) {
    // Zero-length match guard (should not happen, but keeps us out of an infinite loop).
    if (m[0] === '') { master.lastIndex++; continue }

    if (m.index > last) out.push({ t: null, v: src.slice(last, m.index) })

    let cls = null
    for (let i = 1; i < m.length; i++) {
      if (m[i] !== undefined) { cls = classes[i - 1]; break }
    }
    out.push({ t: cls, v: m[0] })
    last = m.index + m[0].length
  }

  if (last < src.length) out.push({ t: null, v: src.slice(last) })
  return out
}

export const SUPPORTED_LANGS = [
  'java', 'sql', 'javascript', 'bash', 'yaml', 'json', 'text',
]
