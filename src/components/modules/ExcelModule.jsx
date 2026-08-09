import { useState } from 'react'
import { excelBasics, excelFormulas } from '../../data/content'
import { checkFormula, formulaDrills } from '../../data/practice'
import CotacaoSimulator from '../CotacaoSimulator'
import ExcelPractice from '../ExcelPractice'

export default function ExcelModule({ setSkillExact, markExercise, progress }) {
  const [tab, setTab] = useState('excel')
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const drillResult = formulaDrills.map((d) => ({
    ...d,
    ok: checkFormula(answers[d.id], d.answers),
  }))
  const drillPassed = drillResult.every((d) => d.ok)
  const drillScore = Math.round(
    (drillResult.filter((d) => d.ok).length / formulaDrills.length) * 100,
  )

  return (
    <div className="panel">
      <section className="hero">
        <h1>🖥️ Excel — pratique fórmulas de verdade</h1>
        <p>
          Treine no navegador ou com arquivo .xlsx. Células amarelas = onde você digita as fórmulas.
        </p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          {[
            ['excel', '1. Praticar no Excel'],
            ['basico', '2. Conceitos'],
            ['formulas', '3. Treino rápido no site'],
            ['cotacao', '4. Decisão de cotação'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`tab ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'excel' && (
          <>
            <h2 style={{ marginTop: 0 }}>Laboratório Excel</h2>
            <ExcelPractice
              progress={progress}
              markExercise={markExercise}
              setSkillExact={setSkillExact}
            />
          </>
        )}

        {tab === 'basico' && (
          <>
            <h2 style={{ marginTop: 0 }}>Checklist do básico</h2>
            <ul className="list-clean">
              {excelBasics.map((item) => (
                <li key={item.title}>
                  <span className="chip">✓</span>
                  <div>
                    <strong>{item.title}</strong>
                    <div className="muted">{item.tip}</div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="muted">
              O melhor treino está na aba <strong>Praticar no Excel</strong>.
            </p>
          </>
        )}

        {tab === 'formulas' && (
          <>
            <h2 style={{ marginTop: 0 }}>Aquecimento no site</h2>
            <p className="muted">
              Antes de abrir o Excel, aqueça digitando as fórmulas aqui. Depois faça os arquivos .xlsx.
            </p>
            <div className="formula-grid" style={{ marginBottom: '1rem' }}>
              {excelFormulas.map((f) => (
                <article key={f.name} className="mini-card">
                  <code>{f.name}</code>
                  <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>{f.use}</p>
                </article>
              ))}
            </div>
            {formulaDrills.map((d) => (
              <div key={d.id} className="mini-card" style={{ marginBottom: '0.7rem' }}>
                <strong>{d.prompt}</strong>
                <div className="muted" style={{ fontSize: '0.85rem', margin: '0.25rem 0 0.5rem' }}>
                  Dica: {d.hint}
                </div>
                <input
                  value={answers[d.id] || ''}
                  onChange={(e) => {
                    setAnswers((a) => ({ ...a, [d.id]: e.target.value }))
                    setChecked(false)
                  }}
                  placeholder='Ex: =SOMA(E2:E21)'
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                />
                {checked && (
                  <div className={`feedback ${drillResult.find((x) => x.id === d.id)?.ok ? 'ok' : 'bad'}`} style={{ marginTop: '0.5rem' }}>
                    {drillResult.find((x) => x.id === d.id)?.ok ? 'Correto' : `Revise. Exemplo: ${d.answers[0]}`}
                  </div>
                )}
              </div>
            ))}
            <button
              className="btn btn-dark"
              onClick={() => {
                setChecked(true)
                if (drillPassed) {
                  markExercise('excel-formulas', true, 'excel', 0)
                  setSkillExact('excel', Math.max(progress.skillScores.excel || 0, 40 + Math.round(drillScore * 0.35)))
                }
              }}
            >
              Verificar fórmulas
            </button>
            {checked && (
              <div className={`feedback ${drillPassed ? 'ok' : 'bad'}`} style={{ marginTop: '0.8rem' }}>
                {drillPassed
                  ? `Aquecimento ok (${drillScore}%). Agora vá em Praticar no Excel.`
                  : `${drillScore}% — corrija e tente de novo.`}
              </div>
            )}
          </>
        )}

        {tab === 'cotacao' && (
          <>
            <h2 style={{ marginTop: 0 }}>Missão: escolher fornecedor (no site)</h2>
            <CotacaoSimulator
              onPass={() => {
                markExercise('excel-cotacao', true, 'excel', 0)
                const base = progress.exerciseDone['xlsx-cotacao'] ? 90 : 70
                setSkillExact('excel', Math.max(progress.skillScores.excel || 0, base))
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
