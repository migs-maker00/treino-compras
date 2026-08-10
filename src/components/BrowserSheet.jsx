import { useEffect, useMemo, useRef, useState } from 'react'
import { browserSheets } from '../data/browserSheets'
import { evaluateSheet, indexToCol, numClose } from '../lib/sheetEngine'

function buildData(sheet) {
  const data = {}
  sheet.headers.forEach((h, c) => {
    data[`${indexToCol(c)}1`] = h
  })
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${r}`] = val
    })
    sheet.editableCols.forEach((c) => {
      const addr = `${indexToCol(c)}${r}`
      if (data[addr] === undefined) data[addr] = ''
    })
  })

  if (sheet.lookupRows) {
    const start = sheet.lookupStartRow || 14
    data[`A${start - 2}`] = sheet.lookupTitle || 'Base'
    sheet.lookupHeaders.forEach((h, c) => {
      data[`${indexToCol(c)}${start - 1}`] = h
    })
    sheet.lookupRows.forEach((row, i) => {
      row.forEach((val, c) => {
        data[`${indexToCol(c)}${start + i}`] = val
      })
    })
  }
  return data
}

function formatDisplay(value) {
  if (value === '' || value == null) return ''
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000)
  }
  return String(value)
}

function EditableCell({ addr, raw, displayValue, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(raw)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!editing) setDraft(raw)
  }, [raw, editing])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  if (editing) {
    return (
      <td className="sheet-edit sheet-editing">
        <input
          ref={inputRef}
          value={draft}
          placeholder="Digite a fórmula, ex: =C2*E2+F2"
          aria-label={`Editar ${addr}`}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onChange(draft)
            setEditing(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onChange(draft)
              setEditing(false)
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              setDraft(raw)
              setEditing(false)
            }
          }}
        />
      </td>
    )
  }

  const empty = raw === '' || raw == null
  return (
    <td className="sheet-edit">
      <button
        type="button"
        className={`sheet-cell-btn ${empty ? 'is-empty' : ''}`}
        onClick={() => {
          setDraft(raw ?? '')
          setEditing(true)
        }}
        aria-label={`Célula ${addr}${empty ? ' vazia' : ''}`}
      >
        {empty ? <span className="sheet-placeholder">clique e digite =</span> : formatDisplay(displayValue)}
      </button>
    </td>
  )
}

export default function BrowserSheet({ progress, markExercise, setSkillExact }) {
  const [sheetId, setSheetId] = useState(browserSheets[0].id)
  const sheet = browserSheets.find((s) => s.id === sheetId)
  const [data, setData] = useState(() => buildData(browserSheets[0]))
  const [showHint, setShowHint] = useState(false)
  const [checked, setChecked] = useState(false)

  const display = useMemo(() => evaluateSheet(data), [data])

  function switchSheet(id) {
    const next = browserSheets.find((s) => s.id === id)
    setSheetId(id)
    setData(buildData(next))
    setChecked(false)
    setShowHint(false)
  }

  function isEditable(r, c) {
    if (r < 2 || r > sheet.rows.length + 1) return false
    return sheet.editableCols.includes(c)
  }

  const colCount = sheet.headers.length
  const bodyRows = sheet.rows.length

  const result = useMemo(() => {
    let ok = 0
    const details = []
    for (let i = 0; i < sheet.rows.length; i += 1) {
      const excelRow = i + 2
      const expected = sheet.expected(sheet.rows[i], sheet)
      let rowOk = true
      expected.forEach((exp, idx) => {
        const col = sheet.editableCols[idx]
        const addr = `${indexToCol(col)}${excelRow}`
        const got = display[addr]
        const good =
          typeof exp === 'string'
            ? String(got).trim().toUpperCase() === String(exp).trim().toUpperCase()
            : numClose(got, exp)
        if (!good) {
          rowOk = false
          details.push(`${addr}: esperado ${exp}, veio ${got === '' ? '(vazio)' : got}`)
        }
      })
      if (rowOk) ok += 1
    }
    return {
      ok,
      total: sheet.rows.length,
      passed: ok === sheet.rows.length,
      details: details.slice(0, 8),
      score: Math.round((ok / sheet.rows.length) * 100),
    }
  }, [display, sheet])

  return (
    <div>
      <div className="tabs">
        {browserSheets.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`tab ${sheetId === s.id ? 'active' : ''}`}
            onClick={() => switchSheet(s.id)}
          >
            {progress.exerciseDone[`browser-${s.id}`] ? '✓ ' : ''}
            {s.title}
          </button>
        ))}
      </div>

      <p className="muted">{sheet.help}</p>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Clique na célula amarela → digite a fórmula → Enter (ou clique fora) para calcular.
      </p>

      <div className="table-wrap sheet-browser">
        <table className="data sheet-table">
          <thead>
            <tr>
              <th className="sheet-rowhead" />
              {sheet.headers.map((h, c) => (
                <th key={`col-${indexToCol(c)}`}>{indexToCol(c)}</th>
              ))}
            </tr>
            <tr>
              <th className="sheet-rowhead">1</th>
              {sheet.headers.map((h) => (
                <th key={`h-${h}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: bodyRows }, (_, i) => {
              const r = i + 2
              return (
                <tr key={r}>
                  <th className="sheet-rowhead">{r}</th>
                  {Array.from({ length: colCount }, (_, c) => {
                    const addr = `${indexToCol(c)}${r}`
                    const editable = isEditable(r, c)
                    const raw = data[addr] ?? ''
                    if (!editable) {
                      return (
                        <td key={addr} className="sheet-locked">
                          <span>{formatDisplay(display[addr] ?? raw)}</span>
                        </td>
                      )
                    }
                    return (
                      <EditableCell
                        key={addr}
                        addr={addr}
                        raw={String(raw)}
                        displayValue={display[addr]}
                        onChange={(value) => {
                          setChecked(false)
                          setData((d) => ({ ...d, [addr]: value }))
                        }}
                      />
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {sheet.lookupRows && (
        <>
          <h4 style={{ marginTop: '1rem' }}>{sheet.lookupTitle}</h4>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  {sheet.lookupHeaders.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.lookupRows.map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell, idx) => (
                      <td key={`${row[0]}-${idx}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: '0.85rem' }}>
            No motor do site, essa Base está nas células A14:D21 para o PROCV.
          </p>
        </>
      )}

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.9rem' }}>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => {
            setChecked(true)
            if (result.passed) {
              markExercise(`browser-${sheet.id}`, true, 'excel', 0)
              const count = browserSheets.filter(
                (s) => progress.exerciseDone[`browser-${s.id}`] || s.id === sheet.id,
              ).length
              setSkillExact('excel', Math.min(100, Math.max(progress.skillScores.excel || 0, 40 + count * 12)))
            }
          }}
        >
          Verificar fórmulas
        </button>
        <button type="button" className="btn btn-soft" onClick={() => setShowHint((v) => !v)}>
          {showHint ? 'Ocultar dicas' : 'Ver dicas de fórmula'}
        </button>
      </div>

      {showHint && (
        <div className="feedback" style={{ marginTop: '0.8rem' }}>
          <ul style={{ marginBottom: 0 }}>
            {sheet.hints.map((h) => (
              <li key={h}><code>{h}</code></li>
            ))}
          </ul>
        </div>
      )}

      {checked && (
        <div className={`feedback ${result.passed ? 'ok' : 'bad'}`} style={{ marginTop: '0.8rem' }}>
          {result.passed
            ? `Aprovado! ${result.ok}/${result.total} linhas corretas.`
            : `${result.ok}/${result.total} corretas. Ajuste as células amarelas.`}
          {result.details.length > 0 && (
            <ul>
              {result.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
