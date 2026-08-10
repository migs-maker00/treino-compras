import { useMemo, useState } from 'react'
import { emailTemplates, glossary } from '../../data/content'
import { emailMissions } from '../../data/practice'

export default function EmailModule({ progress, setSkillExact, markExercise }) {
  const [missionId, setMissionId] = useState(emailMissions[0].id)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [checked, setChecked] = useState(false)
  const [showModel, setShowModel] = useState(false)

  const mission = emailMissions.find((m) => m.id === missionId)
  const model =
    emailTemplates.find((t) => t.id === mission.templateId) ||
    emailTemplates[0]

  const evaluation = useMemo(() => {
    const results = mission.checks.map((c) => ({
      ...c,
      ok: c.test(body, subject),
    }))
    const okCount = results.filter((r) => r.ok).length
    const score = Math.round((okCount / results.length) * 100)
    return {
      results,
      okCount,
      score,
      passed: okCount >= Math.ceil(results.length * 0.8),
    }
  }, [body, subject, mission])

  return (
    <div className="panel">
      <section className="hero">
        <h1>📧 E-mail do dia a dia</h1>
        <p>
          Cotação, cobrança de retorno, confirmação, status de entrega e aviso de divergência —
          o que mais aparece na caixa de entrada.
        </p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          {emailMissions.map((m) => (
            <button
              key={m.id}
              className={`tab ${missionId === m.id ? 'active' : ''}`}
              onClick={() => {
                setMissionId(m.id)
                setSubject('')
                setBody('')
                setChecked(false)
                setShowModel(false)
              }}
            >
              {m.title}
            </button>
          ))}
        </div>

        <div className="mini-card" style={{ marginBottom: '1rem' }}>
          <span className="chip">Missão</span>
          <p style={{ margin: '0.5rem 0 0' }}>{mission.brief}</p>
        </div>

        <label className="muted">Assunto</label>
        <input
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value)
            setChecked(false)
          }}
          placeholder="Assunto do e-mail"
          style={{
            width: '100%',
            padding: '0.7rem 0.85rem',
            borderRadius: 12,
            border: '1px solid var(--line)',
            marginBottom: '0.7rem',
          }}
        />
        <label className="muted">Corpo</label>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            setChecked(false)
          }}
          placeholder="Escreva o e-mail com suas palavras…"
          style={{
            width: '100%',
            minHeight: 180,
            borderRadius: 12,
            border: '1px solid var(--line)',
            padding: '0.85rem',
          }}
        />

        <div style={{ marginTop: '0.7rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-dark"
            onClick={() => {
              setChecked(true)
              if (evaluation.passed) {
                markExercise(`email-${mission.id}`, true, 'email', 0)
                const doneCount = emailMissions.filter(
                  (m) => progress.exerciseDone[`email-${m.id}`] || m.id === mission.id,
                ).length
                setSkillExact(
                  'email',
                  Math.min(100, Math.round((doneCount / emailMissions.length) * 100)),
                )
              }
            }}
          >
            Avaliar checklist
          </button>
          <button className="btn btn-soft" onClick={() => setShowModel((v) => !v)}>
            {showModel ? 'Ocultar modelo' : 'Ver modelo (só depois de tentar)'}
          </button>
        </div>

        {checked && (
          <div className={`feedback ${evaluation.passed ? 'ok' : 'bad'}`}>
            {evaluation.score}% · {evaluation.okCount}/{mission.checks.length} itens
            <ul>
              {evaluation.results.map((r) => (
                <li key={r.id}>
                  {r.ok ? '✓' : '✗'} {r.label}
                </li>
              ))}
            </ul>
            {!evaluation.passed && <div>Precisa de ~80% do checklist para aprovar.</div>}
          </div>
        )}

        {showModel && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Modelo:</strong> {model.subject}</p>
            <div className="email-box">{model.body}</div>
          </div>
        )}

        <h3>Glossário rápido</h3>
        <div className="term-grid">
          {glossary.map((g) => (
            <article key={g.term} className="mini-card">
              <strong>{g.term}</strong>
              <p className="muted" style={{ margin: '0.35rem 0 0' }}>{g.def}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
