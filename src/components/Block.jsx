import React, { useState } from 'react'
import Inline from './Inline.jsx'
import CodeBlock from './CodeBlock.jsx'

const CALLOUT_LABEL = {
  info: 'Note',
  warn: 'Watch out',
  tip: 'Tip',
  trap: 'Common trap',
}

function QA({ title, items }) {
  const [open, setOpen] = useState(() => new Set())
  const toggle = (i) =>
    setOpen((s) => {
      const next = new Set(s)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <div className="block">
      <div className="block-title">{title || 'Interview questions'}</div>
      <div className="qa">
        {items.map((item, i) => (
          <div className="qa-item" key={i}>
            <button
              className="qa-q"
              onClick={() => toggle(i)}
              aria-expanded={open.has(i)}
            >
              <span className="mk">{open.has(i) ? '−' : '+'}</span>
              <span><Inline text={item.q} /></span>
            </button>
            {open.has(i) && (
              <div className="qa-a">
                <p><Inline text={item.a} /></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Block({ block }) {
  switch (block.k) {
    case 'p':
      return (
        <div className="block">
          {block.title && <div className="block-title">{block.title}</div>}
          {(block.body || []).map((para, i) => (
            <p key={i}><Inline text={para} /></p>
          ))}
        </div>
      )

    case 'analogy':
      return (
        <div className="block">
          <div className="analogy">
            <span className="lbl">Real life</span>
            <p><Inline text={block.body} /></p>
          </div>
        </div>
      )

    case 'note':
      return (
        <div className="block">
          <div className={`callout ${block.tone || 'info'}`}>
            <span className="lbl">{CALLOUT_LABEL[block.tone] || 'Note'}</span>
            {block.title && <p><strong>{block.title}</strong></p>}
            <p><Inline text={block.body} /></p>
          </div>
        </div>
      )

    case 'code':
      return (
        <div className="block">
          <CodeBlock lang={block.lang} caption={block.cap} code={block.src} />
        </div>
      )

    case 'list':
      return (
        <div className="block">
          {block.title && <div className="block-title">{block.title}</div>}
          {block.ordered ? (
            <ol>{block.items.map((it, i) => <li key={i}><Inline text={it} /></li>)}</ol>
          ) : (
            <ul>{block.items.map((it, i) => <li key={i}><Inline text={it} /></li>)}</ul>
          )}
        </div>
      )

    case 'table':
      return (
        <div className="block">
          {block.title && <div className="block-title">{block.title}</div>}
          <div className="tbl-wrap">
            <table>
              {block.head && (
                <thead>
                  <tr>{block.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
                </thead>
              )}
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => <td key={j}><Inline text={cell} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'cx':
      return (
        <div className="block">
          <div className="cx">
            <div className="cx-cell">
              <span className="cx-lbl">Time</span>
              <span className="cx-val">{block.time}</span>
            </div>
            <div className="cx-cell">
              <span className="cx-lbl">Space</span>
              <span className="cx-val">{block.space}</span>
            </div>
            <div className="cx-why"><Inline text={block.why} /></div>
          </div>
        </div>
      )

    case 'qa':
      return <QA title={block.title} items={block.items} />

    default:
      return null
  }
}

export default Block
