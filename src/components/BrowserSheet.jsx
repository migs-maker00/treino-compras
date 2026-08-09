import { useMemo, useState } from 'react'
import { browserSheets } from '../data/browserSheets'
import { evaluateSheet, indexToCol, numClose } from '../lib/sheetEngine'

function buildData(sheet) {
  const data = {}
  // header row 1
  sheet.headers.forEach((h, c) => {
    data[`${indexToCol(c)}1`] = h
  })
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${r}`] = val
    })
    // ensure editable cells exist
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

export default function BrowserSheet({ progress, markExercise, setSkillExact }) {
  const [sheetId, setSheetId] = useState(browserSheets[0].id)
  const sheet = browserSheets.find((s) => s.id === sheetId)
  const [data, setData] = useState(() => buildData(browserSheets[0]))
  const [showHint, setShowHint] = useState(false)
  const [checked, setChecked] = useState(false)
  const [editing, setEditing] = useState(null) // address showing formula while focused

  const display = useMemo(() => evaluateSheet(data), [data])

  function switchSheet(id) {
    const next = browserSheets.find((s) => s.id === id)
    setSheetId(id)
    setData(buildData(next))
    setChecked(false)
    setShowHint(false)
    setEditing(null)
  }

  function isEditable(r, c) {
    // r is 1-based excel row
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
          details.push(`${addr}: esperado ${exp}`)
        }
      })
      if (rowOk) ok += 1
    }
    return {
      ok,
      total: sheet.rows.length,
      passed: ok === sheet.rows.length,
      details: details.slice(0, 6),
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

      <div className="table-wrap sheet-browser">
        <table className="data sheet-table">
          <thead>
            <tr>
              <th className="sheet-rowhead" />
              {sheet.headers.map((h, c) => (
                <th key={h}>{indexToCol(c)}</th>
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
                    const shown =
                      editing === addr ? raw : display[addr] === '' || display[addr] == null
                        ? ''
                        : String(display[addr])
                    return (
                      <td key={addr} className={editable ? 'sheet-edit' : 'sheet-locked'}>
                        {editable ? (
                          <input
                            value={editing === addr ? raw : shown}
                            placeholder="=…"
                            onFocus={() => setEditing(addr)}
                            onBlur={() => setEditing(null)}
                            onChange={(e) => {
                              setChecked(false)
                              setData((d) => ({ ...d, [addr]: e.target.value }))
                            }}
                          />
                        ) : (
                          <span>{String(display[addr] ?? raw)}</span>
                        )}
                      </td>
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
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td key={`${row[0]}-${cell}`}>{cell}</td>
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
              setSkillExact('excel', Math.max(progress.skillScores.excel || 0, 50 + count * 15))
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
