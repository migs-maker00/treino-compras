import { useMemo, useRef, useState } from 'react'
import { excelPacks, publicPackUrl, verifyUploadedFile } from '../lib/excelPacks'

const EXCEL_WEB_LAUNCH = 'https://www.microsoft365.com/launch/excel'
const EXCEL_WEB_HOME = 'https://excel.cloud.microsoft/'

function absoluteFileUrl(filename) {
  if (typeof window === 'undefined') {
    return `https://treino-compras.vercel.app${publicPackUrl(filename)}`
  }
  return `${window.location.origin}${publicPackUrl(filename)}`
}

function excelOnlineViewUrl(filename) {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absoluteFileUrl(filename))}`
}

export default function ExcelWebLinks({ progress, markExercise, setSkillExact }) {
  const [activeId, setActiveId] = useState(excelPacks[0].id)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)
  const pack = excelPacks.find((p) => p.id === activeId)

  const links = useMemo(
    () => ({
      view: excelOnlineViewUrl(pack.filename),
      file: absoluteFileUrl(pack.filename),
    }),
    [pack.filename],
  )

  const doneCount = excelPacks.filter((p) => progress.exerciseDone[`excelweb-${p.id}`]).length
  const isDone = !!progress.exerciseDone[`excelweb-${pack.id}`]

  async function handleUpload(file) {
    if (!file) return
    setBusy(true)
    setResult(null)
    try {
      const report = await verifyUploadedFile(pack, file)
      setResult(report)
      if (report.passed) {
        markExercise(`excelweb-${pack.id}`, true, 'excel', 0)
        const next = doneCount + (isDone ? 0 : 1)
        setSkillExact('excel', Math.max(progress.skillScores.excel || 0, 55 + next * 15))
      }
    } catch (err) {
      setResult({
        passed: false,
        score: 0,
        message: `Não consegui ler o arquivo. Exporte como CSV (Arquivo → Exportar → Baixar como CSV) e envie de novo. (${err.message})`,
      })
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="muted">
        Abra no <strong>Excel na Web</strong>, preencha as células amarelas e depois envie o{' '}
        <strong>CSV</strong> (ou .xlsx, se tiver) para correção. Só conclui se estiver certo.
      </p>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <a className="btn btn-soft" href={EXCEL_WEB_LAUNCH} target="_blank" rel="noreferrer">
          Abrir Excel na Web
        </a>
        <a className="btn btn-soft" href={EXCEL_WEB_HOME} target="_blank" rel="noreferrer">
          Página do Excel Online
        </a>
      </div>

      <div className="tabs">
        {excelPacks.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`tab ${activeId === p.id ? 'active' : ''}`}
            onClick={() => {
              setActiveId(p.id)
              setResult(null)
            }}
          >
            {progress.exerciseDone[`excelweb-${p.id}`] ? '✓ ' : ''}
            {p.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      <div className="mini-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
          <span className="chip">{pack.level}</span>
          <span className="chip">{pack.time}</span>
          {isDone && <span className="chip-ok chip">Corrigido e aprovado</span>}
        </div>
        <h3 style={{ margin: '0 0 0.4rem' }}>{pack.title}</h3>
        <p className="muted" style={{ marginTop: 0 }}>{pack.summary}</p>
        <ol>
          {pack.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="mini-card" style={{ marginBottom: '1rem' }}>
        <strong>Passo a passo com correção</strong>
        <ol style={{ marginBottom: 0 }}>
          <li>Abra o exercício no Excel na Web e edite as células amarelas.</li>
          <li>
            Fique na aba do exercício (Cotacao, Pedidos ou Decisao) — não na de Instruções.
          </li>
          <li>
            <strong>Arquivo → Exportar → Baixar como CSV</strong> (CSV UTF-8 também serve).
          </li>
          <li>Envie o CSV aqui para o site corrigir.</li>
        </ol>
        <p className="muted" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
          PDF e ODS não servem para correção. Se aparecer .xlsx, também aceitamos.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
        <a className="btn btn-primary" href={links.view} target="_blank" rel="noreferrer">
          1. Abrir exercício no Excel na Web
        </a>
        <button
          type="button"
          className="btn btn-dark"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Corrigindo…' : '2. Enviar para correção (.csv)'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>

      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Arquivo do exercício:{' '}
        <a href={links.file} target="_blank" rel="noreferrer">
          {pack.filename}
        </a>
      </p>

      {result && (
        <div
          className={`feedback ${result.passed ? 'ok' : 'bad'}`}
          style={{ marginTop: '0.9rem' }}
        >
          {result.score != null && (
            <div>
              <strong>Score:</strong> {result.score}%
            </div>
          )}
          <div>{result.message}</div>
          {result.details?.length > 0 && (
            <ul>
              {result.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          {result.passed ? (
            <div style={{ marginTop: '0.5rem' }}>Exercício concluído por correção automática.</div>
          ) : (
            <div style={{ marginTop: '0.5rem' }}>
              Ainda não concluiu. Corrija no Excel na Web e envie de novo.
            </div>
          )}
        </div>
      )}

      <p style={{ marginTop: '0.9rem' }}>
        Aprovados na correção: <strong>{doneCount}/{excelPacks.length}</strong>
      </p>

      <div className="cards" style={{ marginTop: '1rem' }}>
        {excelPacks.map((p) => {
          const view = excelOnlineViewUrl(p.filename)
          const done = !!progress.exerciseDone[`excelweb-${p.id}`]
          return (
            <article key={p.id} className="mini-card">
              <strong>
                {done ? '✓ ' : ''}
                {p.title}
              </strong>
              <p className="muted" style={{ margin: '0.35rem 0 0.7rem' }}>{p.summary}</p>
              <a className="btn btn-primary" href={view} target="_blank" rel="noreferrer">
                Abrir no Excel Web
              </a>
            </article>
          )
        })}
      </div>
    </div>
  )
}
