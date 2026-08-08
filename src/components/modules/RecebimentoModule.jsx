import { useMemo, useState } from 'react'
import { fluxo, receivingChecks, receivingScenarios } from '../../data/content'

const OPTIONS = [
  { id: 'faltam-luvas', label: 'Faltam 2 luvas nitrílicas G' },
  { id: 'produto-errado', label: 'Produto errado: veio mangueira de água em vez de hidráulica' },
  { id: 'ok', label: 'Sem divergência' },
  { id: 'nf', label: 'Nota fiscal não bate' },
]

const EXPECTED_BY_CASE = {
  1: ['faltam-luvas'],
  2: ['produto-errado'],
  3: ['ok'],
}

export default function RecebimentoModule({ markModule }) {
  const [scenario, setScenario] = useState(0)
  const [answers, setAnswers] = useState([])
  const [revealed, setRevealed] = useState(false)
  const current = receivingScenarios[scenario]
  const expectedIds = EXPECTED_BY_CASE[current.id]

  const isCorrect = useMemo(() => {
    if (answers.length !== expectedIds.length) return false
    return expectedIds.every((id) => answers.includes(id))
  }, [answers, expectedIds])

  function toggleAnswer(id) {
    setAnswers((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
    setRevealed(false)
  }

  return (
    <div className="panel">
      <section className="hero">
        <h1>📦 Recebimento e conferência</h1>
        <p>
          Não basta ver “chegou uma caixa”. Compare o que deveria chegar com o que realmente chegou.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Fluxo completo</h2>
        <div className="flow">
          {fluxo.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>

        <h3>Os 6 pontos da conferência</h3>
        <div className="term-grid">
          {receivingChecks.map((c) => (
            <article key={c.id} className="mini-card">
              <span className="chip">{c.id}. {c.title}</span>
              <p style={{ margin: '0.5rem 0 0' }}>{c.q}</p>
            </article>
          ))}
        </div>

        <h3>Simulador de conferência</h3>
        <div className="tabs">
          {receivingScenarios.map((s, i) => (
            <button
              key={s.id}
              className={`tab ${scenario === i ? 'active' : ''}`}
              onClick={() => {
                setScenario(i)
                setAnswers([])
                setRevealed(false)
              }}
            >
              Caso {i + 1}
            </button>
          ))}
        </div>

        <div className="grid-2">
          <div className="mini-card">
            <strong>Pedido</strong>
            <ul>
              {current.pedido.map((p) => (
                <li key={p.item}>
                  {p.qtd}
                  {p.unidade ? ` ${p.unidade}` : ' un.'} — {p.item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mini-card">
            <strong>Chegou</strong>
            <ul>
              {current.chegou.map((p) => (
                <li key={p.item}>
                  {p.qtd}
                  {p.unidade ? ` ${p.unidade}` : ' un.'} — {p.item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{ marginTop: '1rem' }}>
          <strong>O que você identificou?</strong> (marque só o que se aplica a este caso)
        </p>
        {OPTIONS.map((opt) => (
          <label key={opt.id} className="check-row" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={answers.includes(opt.id)}
              onChange={() => toggleAnswer(opt.id)}
            />
            <span>{opt.label}</span>
          </label>
        ))}

        <button
          className="btn btn-dark"
          style={{ marginTop: '0.8rem' }}
          onClick={() => setRevealed(true)}
          disabled={answers.length === 0}
        >
          Conferir resposta
        </button>

        {revealed && (
          <div className={`feedback ${isCorrect ? 'ok' : 'bad'}`}>
            {isCorrect ? (
              <>
                Certo! Gabarito:{' '}
                <strong>
                  {current.problemas.length === 0
                    ? 'sem divergência'
                    : current.problemas.join(' · ')}
                </strong>
              </>
            ) : (
              <>
                Ainda não. Gabarito deste caso:{' '}
                <strong>
                  {current.problemas.length === 0
                    ? 'sem divergência'
                    : current.problemas.join(' · ')}
                </strong>
                . Marque apenas o problema real (ou “Sem divergência” se tudo bater).
              </>
            )}
          </div>
        )}

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => markModule('recebimento')}>
          Marcar módulo Recebimento como estudado
        </button>
      </div>
    </div>
  )
}
