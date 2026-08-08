import { weekPlan } from '../../data/content'

export default function PlanoModule({ progress, toggleDay, onNavigate }) {
  return (
    <div className="panel">
      <section className="hero">
        <h1>📅 Plano de 7 dias</h1>
        <p>
          Um ritmo realista para chegar preparado. Foque em Excel + pesquisa + fornecedores +
          e-mail + conferência. O resto você aprende mais rápido dentro da empresa.
        </p>
      </section>

      <div className="light-panel">
        {weekPlan.map((d) => {
          const done = progress.completedDays.includes(d.day)
          return (
            <div key={d.day} className="day-card">
              <div className="day-num">D{d.day}</div>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <strong>{d.title}</strong>
                  <span className="chip">{d.time}</span>
                  {done && <span className="chip-ok chip">Concluído</span>}
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
                  Abrir conteúdo
                </button>
              </div>
              <label className="check-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleDay(d.day)}
                />
                <span>Dia feito</span>
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
