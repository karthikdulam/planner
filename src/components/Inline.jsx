import React from 'react'

/**
 * Minimal inline markup for content strings: **bold**, `code`, *italic*.
 * Rendered to real React nodes — never dangerouslySetInnerHTML.
 */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g

export function Inline({ text }) {
  if (text == null) return null
  const parts = String(text).split(TOKEN)

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return <code className="ic" key={i}>{part.slice(1, -1)}</code>
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

export default Inline
