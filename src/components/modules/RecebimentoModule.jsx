import { useMemo, useState } from 'react'
import { fluxo, receivingChecks, receivingScenarios } from '../../data/content'
import { receivingExtra, receivingOptionLabels } from '../../data/practice'

const BASE_CASES = [
  {
    ...receivingScenarios[0],
    problemas: ['faltam-luvas'],
    options: ['faltam-luvas', 'produto-errado', 'ok', 'nf'],
  },
  {
    ...receivingScenarios[1],
    problemas: ['produto-errado'],
    options: ['faltam-luvas', 'produto-errado', 'ok', 'danificado'],
  },
  {
    ...receivingScenarios[2],
    problemas: ['ok'],
    options: ['faltam-luvas', 'produto-errado', 'ok', 'nf'],
  },
  ...receivingExtra,
]

export default function RecebimentoModule({ progress, setSkillExact, markExercise }) {
  const [scenario, setScenario] = useState(0)
  const [answers, setAnswers] = useState([])
  const [revealed, setRevealed] = useState(false)
  const current = BASE_CASES[scenario]
  const expected = current.problemas

  const isCorrect = useMemo(() => {
    if (answers.length !== expected.length) return false
    return expected.every((id) => answers.includes(id))
  }, [answers, expected])

  function toggleAnswer(id) {
    setAnswers((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
    setRevealed(false)
  }

  const passedCount = BASE_CASES.filter((c) => progress.exerciseDone[`rec-${c.id}`]).length

  return (
    <div className="panel">
      <section className="hero">
        <h1>📦 Conferência na prática</h1>
        <p>Compare pedido × mercadoria × NF. Aprove só quando achar a divergência certa.</p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Fluxo</h2>
        <div className="flow">
          {fluxo.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>

        <h3>Os 6 pontos</h3>
        <div className="term-grid">
          {receivingChecks.map((c) => (
            <article key={c.id} className="mini-card">
              <span className="chip">{c.id}. {c.title}</span>
              <p style={{ margin: '0.5rem 0 0' }}>{c.q}</p>
            </article>
          ))}
        </div>

        <h3>Casos ({passedCount}/{BASE_CASES.length} aprovados)</h3>
        <div className="tabs">
          {BASE_CASES.map((s, i) => (
            <button
              key={s.id}
              className={`tab ${scenario === i ? 'active' : ''}`}
              onClick={() => {
                setScenario(i)
                setAnswers([])
                setRevealed(false)
              }}
            >
              {progress.exerciseDone[`rec-${s.id}`] ? '✓ ' : ''}Caso {i + 1}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div className="mini-card">
            <strong>Pedido</strong>
            <ul>
              {current.pedido.map((p) => (
                <li key={p.item}>
                  {p.qtd}{p.unidade ? ` ${p.unidade}` : ' un.'} — {p.item}
                  {p.preco != null ? ` (R$ ${p.preco})` : ''}
                </li>
              ))}
            </ul>
          </div>
          <div className="mini-card">
            <strong>Chegou</strong>
            <ul>
              {current.chegou.map((p) => (
                <li key={p.item}>
                  {p.qtd}{p.unidade ? ` ${p.unidade}` : ' un.'} — {p.item}
                  {p.preco != null ? ` (R$ ${p.preco})` : ''}
                </li>
              ))}
            </ul>
            {current.nf && (
              <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                NF: itens {current.nf.itensOk ? 'ok' : 'divergente'} · valores {current.nf.valorOk ? 'ok' : 'divergente'}
                {current.nf.obs ? ` · ${current.nf.obs}` : ''}
              </p>
            )}
            {current.estado && current.estado !== 'ok' && (
              <p className="chip-bad chip">Estado: {current.estado}</p>
            )}
          </div>
        </div>

        <p style={{ marginTop: '1rem' }}>
          <strong>Marque só o que se aplica</strong>
        </p>
        {(current.options || []).map((id) => (
          <label key={id} className="check-row" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={answers.includes(id)}
              onChange={() => toggleAnswer(id)}
            />
            <span>{receivingOptionLabels[id] || id}</span>
          </label>
        ))}

        <button
          className="btn btn-dark"
          style={{ marginTop: '0.8rem' }}
          disabled={answers.length === 0}
          onClick={() => {
            setRevealed(true)
            if (isCorrect) {
              markExercise(`rec-${current.id}`, true, 'recebimento', 0)
              const next = passedCount + (progress.exerciseDone[`rec-${current.id}`] ? 0 : 1)
              setSkillExact('recebimento', Math.min(100, Math.round((next / BASE_CASES.length) * 100)))
            }
          }}
        >
          Conferir
        </button>

        {revealed && (
          <div className={`feedback ${isCorrect ? 'ok' : 'bad'}`}>
            {isCorrect ? (
              <>Certo! {expected.map((e) => receivingOptionLabels[e]).join(' · ')}</>
            ) : (
              <>
                Ainda não. Gabarito: {expected.map((e) => receivingOptionLabels[e]).join(' · ')}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
