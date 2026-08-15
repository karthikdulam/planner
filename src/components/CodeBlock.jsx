import React, { useMemo, useState } from 'react'
import { tokenize } from '../lib/highlight.js'

export function CodeBlock({ lang = 'java', caption, code }) {
  const [copied, setCopied] = useState(false)
  const tokens = useMemo(() => tokenize(code, lang), [code, lang])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked — nothing useful to do */
    }
  }

  return (
    <div className="code">
      <div className="code-bar">
        <span className="code-lang">{lang}</span>
        {caption && <span className="code-cap">{caption}</span>}
        <button className="code-copy" onClick={copy} aria-label="Copy code">
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre>
        <code>
          {tokens.map((t, i) =>
            t.t ? (
              <span className={t.t} key={i}>{t.v}</span>
            ) : (
              <React.Fragment key={i}>{t.v}</React.Fragment>
            )
          )}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock
