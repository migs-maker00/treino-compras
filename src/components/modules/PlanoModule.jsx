import { weekPlan } from '../../data/content'

export default function PlanoModule({ progress, toggleDay, onNavigate, skillScores }) {
  return (
    <div className="panel">
      <section className="hero">
        <h1>📅 Plano de 7 dias</h1>
        <p>
          Meta: rotina leve e segura — pesquisar, cuidar do e-mail e conferir mercadoria. Excel só
          como apoio. Marque o dia depois de praticar de verdade.
        </p>
      </section>

      <div className="light-panel">
        {weekPlan.map((d, idx) => {
          const done = progress.completedDays.includes(d.day)
          const prevDone = d.day === 1 || progress.completedDays.includes(d.day - 1)
          const skillHint = d.module === 'simulacao' ? 'simulacao' : d.module
          const skill = skillScores?.[skillHint] || 0

          return (
            <div key={d.day} className="day-card">
              <div className="day-num">D{d.day}</div>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <strong>{d.title}</strong>
                  <span className="chip">{d.time}</span>
                  {done && <span className="chip-ok chip">Concluído</span>}
                  {!prevDone && <span className="chip-warn chip">Recomendado: faça o dia anterior</span>}
                  <span className="chip">Skill {skill}%</span>
                </div>
                <ul style={{ margin: '0.55rem 0 0.7rem', paddingLeft: '1.1rem' }}>
                  {d.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <button
                  className="btn btn-soft"
                  onClick={() => onNavigate(d.module === 'simulacao' ? 'simulacao' : d.module)}
                >
                  Abrir prática
                </button>
              </div>
              <label className="check-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleDay(d.day)}
                />
                <span>{idx === 0 || prevDone ? 'Dia feito' : 'Marcar mesmo assim'}</span>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
