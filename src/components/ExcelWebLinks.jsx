import { useMemo, useState } from 'react'
import { excelPacks, publicPackUrl } from '../lib/excelPacks'

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

const HOW_TO = [
  'Clique em Abrir no Excel na Web (abre o exercício no site da Microsoft).',
  'Entre com sua conta Microsoft (é grátis).',
  'Clique em Editar no navegador / Salvar uma cópia no OneDrive.',
  'Preencha as células amarelas com as fórmulas.',
  'Volte aqui e marque o exercício como feito.',
]

export default function ExcelWebLinks({ progress, markExercise, setSkillExact }) {
  const [activeId, setActiveId] = useState(excelPacks[0].id)
  const pack = excelPacks.find((p) => p.id === activeId)

  const links = useMemo(
    () => ({
      view: excelOnlineViewUrl(pack.filename),
      file: absoluteFileUrl(pack.filename),
      launch: EXCEL_WEB_LAUNCH,
      home: EXCEL_WEB_HOME,
    }),
    [pack.filename],
  )

  const doneCount = excelPacks.filter((p) => progress.exerciseDone[`excelweb-${p.id}`]).length

  function markDone() {
    markExercise(`excelweb-${pack.id}`, true, 'excel', 0)
    const next = doneCount + (progress.exerciseDone[`excelweb-${pack.id}`] ? 0 : 1)
    setSkillExact('excel', Math.max(progress.skillScores.excel || 0, 55 + next * 15))
  }

  return (
    <div>
      <p className="muted">
        Os exercícios abrem no <strong>Excel na Web</strong> (site da Microsoft). Não usa o Excel
        instalado no PC.
      </p>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <a className="btn btn-primary" href={EXCEL_WEB_LAUNCH} target="_blank" rel="noreferrer">
          Abrir Excel na Web
        </a>
        <a className="btn btn-soft" href={EXCEL_WEB_HOME} target="_blank" rel="noreferrer">
          Página inicial do Excel Online
        </a>
      </div>

      <div className="tabs">
        {excelPacks.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`tab ${activeId === p.id ? 'active' : ''}`}
            onClick={() => setActiveId(p.id)}
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
        </div>
        <h3 style={{ margin: '0 0 0.4rem' }}>{pack.title}</h3>
        <p className="muted" style={{ marginTop: 0 }}>{pack.summary}</p>
        <ol>
          {pack.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <a className="btn btn-primary" href={links.view} target="_blank" rel="noreferrer">
          Abrir este exercício no Excel na Web
        </a>
        <a className="btn btn-dark" href={links.file} target="_blank" rel="noreferrer">
          Link direto do arquivo
        </a>
        <button
          type="button"
          className="btn btn-soft"
          onClick={markDone}
          disabled={!!progress.exerciseDone[`excelweb-${pack.id}`]}
        >
          {progress.exerciseDone[`excelweb-${pack.id}`]
            ? 'Exercício marcado'
            : 'Marquei como concluído'}
        </button>
      </div>

      <div className="mini-card">
        <strong>Como editar de graça</strong>
        <ol style={{ marginBottom: 0 }}>
          {HOW_TO.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <p style={{ marginTop: '0.9rem' }}>
        Exercícios no Excel Web: <strong>{doneCount}/{excelPacks.length}</strong>
      </p>

      <div className="cards" style={{ marginTop: '1rem' }}>
        {excelPacks.map((p) => {
          const view = excelOnlineViewUrl(p.filename)
          return (
            <article key={p.id} className="mini-card">
              <strong>{p.title}</strong>
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
