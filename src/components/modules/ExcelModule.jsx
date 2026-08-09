import { useState } from 'react'
import { excelBasics, excelFormulas } from '../../data/content'
import { checkFormula, formulaDrills } from '../../data/practice'
import CotacaoSimulator from '../CotacaoSimulator'

export default function ExcelModule({ setSkillExact, markExercise, progress }) {
  const [tab, setTab] = useState('basico')
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
        <h1>🖥️ Excel — execute, não só leia</h1>
        <p>
          Objetivo: chegar sabendo organizar planilha, escrever fórmulas básicas e decidir cotação
          com critério — não só clicar “concluído”.
        </p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          {[
            ['basico', '1. Conceitos'],
            ['formulas', '2. Digite a fórmula'],
            ['cotacao', '3. Decida cotação'],
            ['sheets', '4. No Excel/Sheets'],
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
            <p className="muted">Depois vá para a aba <strong>Digite a fórmula</strong> e pratique.</p>
          </>
        )}

        {tab === 'formulas' && (
          <>
            <h2 style={{ marginTop: 0 }}>Prova rápida de fórmulas</h2>
            <p className="muted">Digite a fórmula como no Excel (aceita PT ou EN). Precisa acertar todas.</p>
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
                  ? `Aprovado nas fórmulas (${drillScore}%). Agora faça a cotação.`
                  : `${drillScore}% — corrija as fórmulas marcadas e tente de novo.`}
              </div>
            )}
          </>
        )}

        {tab === 'cotacao' && (
          <>
            <h2 style={{ marginTop: 0 }}>Missão: escolher fornecedor</h2>
            <CotacaoSimulator
              onPass={() => {
                markExercise('excel-cotacao', true, 'excel', 0)
                const base = progress.exerciseDone['excel-formulas'] ? 85 : 70
                setSkillExact('excel', Math.max(progress.skillScores.excel || 0, base))
              }}
            />
          </>
        )}

        {tab === 'sheets' && (
          <>
            <h2 style={{ marginTop: 0 }}>Prática no Excel ou Google Sheets</h2>
            <p>Abra o Excel/Sheets e reproduza isto (10–15 min):</p>
            <ol>
              <li>Crie a planilha <strong>COTAÇÃO DE FORNECEDORES</strong>.</li>
              <li>Colunas: Produto | Spec | Qtd | Fornecedor1 | Preço1 | Frete1 | Fornecedor2 | Preço2 | Frete2 | Total1 | Total2 | Melhor.</li>
              <li>Cadastre 10 produtos reais da sua rotina (ou use os do site).</li>
              <li>Em Total use <code>=Preço+Frete</code>.</li>
              <li>Em Melhor use <code>=SE(Total1&lt;Total2;"F1";"F2")</code> (ou MÍNIMO).</li>
              <li>Congele o cabeçalho e ative filtro.</li>
            </ol>
            <div className="feedback">
              Dica: o site treina a decisão; o Excel/Sheets treina o músculo da planilha.
              Faça os dois.
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: '0.8rem' }}
              onClick={() => {
                markExercise('excel-sheets', true, 'excel', 0)
                setSkillExact('excel', Math.max(progress.skillScores.excel || 0, 75))
              }}
            >
              Marquei: já reproduzi no Excel/Sheets
            </button>
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              (Esse botão é uma auto-declaração honesta — use só se você realmente abriu a planilha.)
            </p>
          </>
        )}
      </div>
    </div>
  )
}
