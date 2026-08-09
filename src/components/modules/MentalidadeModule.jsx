import { useState } from 'react'
import { mindsetCases, quizMindset } from '../../data/content'
import { mindsetDrills, scoreMindsetAnswers } from '../../data/practice'
import Quiz from '../Quiz'

export default function MentalidadeModule({ progress, setSkillExact, markExercise }) {
  const [drillId, setDrillId] = useState(mindsetDrills[0].id)
  const [text, setText] = useState('')
  const [checked, setChecked] = useState(false)

  const drill = mindsetDrills.find((d) => d.id === drillId)
  const result = scoreMindsetAnswers(text, drill)

  return (
    <div className="panel">
      <section className="hero">
        <h1>🧠 Pensar como comprador</h1>
        <p>
          Recebeu pedido vago? Não pesquise ainda. Escreva as perguntas que faltam.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Casos (referência)</h2>
        {mindsetCases.map((c) => (
          <article key={c.id} className="mini-card" style={{ marginBottom: '0.7rem' }}>
            <span className="chip-warn chip">Solicitação vaga</span>
            <h3 style={{ margin: '0.5rem 0 0.25rem' }}>&ldquo;{c.request}&rdquo;</h3>
            <p className="muted" style={{ margin: 0 }}>Erro comum: {c.wrong}</p>
            <ul>
              {c.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </article>
        ))}

        <h3>Prática: escreva as perguntas</h3>
        <div className="tabs">
          {mindsetDrills.map((d) => (
            <button
              key={d.id}
              className={`tab ${drillId === d.id ? 'active' : ''}`}
              onClick={() => {
                setDrillId(d.id)
                setText('')
                setChecked(false)
              }}
            >
              {progress.exerciseDone[`mind-${d.id}`] ? '✓ ' : ''}Caso
            </button>
          ))}
        </div>

        <div className="mini-card" style={{ marginBottom: '0.8rem' }}>
          <span className="chip">Pedido</span>
          <h3 style={{ margin: '0.45rem 0 0' }}>&ldquo;{drill.request}&rdquo;</h3>
          <p className="muted">Escreva pelo menos 4–5 perguntas (uma por linha).</p>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setChecked(false)
          }}
          placeholder={"Ex:\nQual material?\nQual medida?\nQual comprimento?\nPara qual aplicação?\nQual quantidade exata?"}
          style={{
            width: '100%',
            minHeight: 160,
            borderRadius: 12,
            border: '1px solid var(--line)',
            padding: '0.85rem',
          }}
        />

        <button
          className="btn btn-dark"
          style={{ marginTop: '0.7rem' }}
          onClick={() => {
            setChecked(true)
            if (result.passed) {
              markExercise(`mind-${drill.id}`, true, 'mentalidade', 0)
              const count = mindsetDrills.filter(
                (d) => progress.exerciseDone[`mind-${d.id}`] || d.id === drill.id,
              ).length
              setSkillExact('mentalidade', Math.min(100, Math.round((count / mindsetDrills.length) * 75)))
            }
          }}
        >
          Avaliar perguntas
        </button>

        {checked && (
          <div className={`feedback ${result.passed ? 'ok' : 'bad'}`}>
            Score {result.score}% · cobriu: {result.found.join(', ') || 'nada ainda'}
            {!result.passed && (
              <div>Faltou explorar: {result.missing.join(', ')}. Escreva mais perguntas.</div>
            )}
          </div>
        )}

        <div className="feedback" style={{ marginTop: '1rem' }}>
          <strong>Regra de ouro:</strong> preço + frete + prazo + qualidade + disponibilidade.
        </div>

        <h3>Quiz</h3>
        <Quiz
          questions={quizMindset}
          onFinish={(score, total, approved) => {
            if (approved) {
              markExercise('mind-quiz', true, 'mentalidade', 0)
              setSkillExact(
                'mentalidade',
                Math.max(progress.skillScores.mentalidade || 0, 75 + Math.round((score / total) * 25)),
              )
            }
          }}
        />
      </div>
    </div>
  )
}
