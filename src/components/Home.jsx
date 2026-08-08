import { modules, weekPlan } from '../data/content'

export default function Home({ onNavigate, progress, toggleDay }) {
  return (
    <div className="panel">
      <section className="hero">
        <p style={{ margin: '0 0 0.5rem', color: 'var(--teal)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Treino Compras
        </p>
        <h1>Chegue pronto para compras, fornecedores e conferência.</h1>
        <p>
          Um caminho prático em 7 dias: Excel, pesquisa, e-mail, materiais e o jeito de pensar
          de quem compra bem — sem precisar virar engenheiro naval.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('plano')}>
            Ver plano de 7 dias
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('simulacao')}>
            Ir para simulação
          </button>
        </div>
      </section>

      <h2 className="section-title">Os 6 blocos</h2>
      <div className="cards">
        {modules.map((m) => (
          <article key={m.id} className="card" onClick={() => onNavigate(m.id)}>
            <span className="eyebrow">{m.priority}</span>
            <h3>
              {m.icon} {m.title}
            </h3>
            <p>{m.short}</p>
          </article>
        ))}
      </div>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Seu progresso nesta semana</h2>
        <p className="muted">Marque os dias conforme for avançando. O progresso fica salvo neste navegador.</p>
        {weekPlan.map((d) => {
          const done = progress.completedDays.includes(d.day)
          return (
            <label key={d.day} className="day-card" style={{ cursor: 'pointer' }}>
              <div className="day-num">D{d.day}</div>
              <div>
                <strong>{d.title}</strong>
                <div className="muted" style={{ fontSize: '0.9rem' }}>
                  {d.time} · {d.tasks.length} tarefas
                </div>
              </div>
              <div className="check-row">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleDay(d.day)}
                />
                <span>{done ? 'Feito' : 'Pendente'}</span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
