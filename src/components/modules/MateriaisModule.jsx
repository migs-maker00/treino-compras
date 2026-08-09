import { useState } from 'react'
import { materialCategories, quizMaterials } from '../../data/content'
import { matchLoose, materialSpecs } from '../../data/practice'
import Quiz from '../Quiz'

export default function MateriaisModule({ progress, setSkillExact, markExercise }) {
  const [specId, setSpecId] = useState(materialSpecs[0].id)
  const [values, setValues] = useState({})
  const [checked, setChecked] = useState(false)

  const current = materialSpecs.find((m) => m.id === specId)
  const results = current.fields.map((f) => ({
    ...f,
    ok: matchLoose(values[f.key], f.answer),
  }))
  const passed = results.every((r) => r.ok)

  return (
    <div className="panel">
      <section className="hero">
        <h1>⚓ Materiais com especificação</h1>
        <p>
          Não basta saber a categoria. Treine ler o produto: tipo, material, medida, norma.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Catálogo base</h2>
        <div className="cat-grid">
          {materialCategories.map((cat) => (
            <article key={cat.id} className="mini-card">
              <h3 style={{ margin: '0 0 0.5rem' }}>{cat.icon} {cat.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {cat.items.map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <h3>Prática: decodifique o produto</h3>
        <div className="tabs">
          {materialSpecs.map((m) => (
            <button
              key={m.id}
              className={`tab ${specId === m.id ? 'active' : ''}`}
              onClick={() => {
                setSpecId(m.id)
                setValues({})
                setChecked(false)
              }}
            >
              {progress.exerciseDone[`mat-${m.id}`] ? '✓ ' : ''}Item
            </button>
          ))}
        </div>

        <div className="mini-card" style={{ marginBottom: '0.8rem' }}>
          <span className="chip">Produto</span>
          <h3 style={{ margin: '0.45rem 0 0' }}>{current.label}</h3>
        </div>

        {current.fields.map((f) => (
          <div key={f.key} style={{ marginBottom: '0.65rem' }}>
            <label className="muted">{f.label}</label>
            <input
              value={values[f.key] || ''}
              onChange={(e) => {
                setValues((v) => ({ ...v, [f.key]: e.target.value }))
                setChecked(false)
              }}
              placeholder={`Ex.: ${f.answer}`}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: 10,
                border: '1px solid var(--line)',
              }}
            />
            {checked && (
              <div className={`feedback ${results.find((r) => r.key === f.key)?.ok ? 'ok' : 'bad'}`} style={{ marginTop: '0.4rem' }}>
                {results.find((r) => r.key === f.key)?.ok ? 'Ok' : `Esperado algo como: ${f.answer}`}
              </div>
            )}
          </div>
        ))}

        <button
          className="btn btn-dark"
          onClick={() => {
            setChecked(true)
            if (passed) {
              markExercise(`mat-${current.id}`, true, 'materiais', 0)
              const count = materialSpecs.filter(
                (m) => progress.exerciseDone[`mat-${m.id}`] || m.id === current.id,
              ).length
              setSkillExact('materiais', Math.min(100, Math.round((count / materialSpecs.length) * 70)))
            }
          }}
        >
          Verificar especificação
        </button>

        <h3>Quiz de categorias</h3>
        <Quiz
          questions={quizMaterials}
          onFinish={(score, total, approved) => {
            if (approved) {
              markExercise('mat-quiz', true, 'materiais', 0)
              setSkillExact(
                'materiais',
                Math.max(progress.skillScores.materiais || 0, 70 + Math.round((score / total) * 30)),
              )
            }
          }}
        />
      </div>
    </div>
  )
}
