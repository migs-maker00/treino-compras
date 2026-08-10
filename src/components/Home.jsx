import { modules, weekPlan } from '../data/content'
import { SKILLS } from '../hooks/useProgress'

const skillLabels = {
  excel: 'Excel',
  pesquisa: 'Pesquisa',
  email: 'E-mail',
  recebimento: 'Recebimento',
  materiais: 'Materiais',
  mentalidade: 'Mentalidade',
  simulacao: 'Simulação',
}

export default function Home({ onNavigate, progress, toggleDay, skillScores, percent, readiness }) {
  return (
    <div className="panel">
      <section className="hero">
        <p style={{ margin: '0 0 0.5rem', color: 'var(--teal)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Treino Compras · rotina do cargo
        </p>
        <h1>Pesquisar, responder e-mail e conferir o que chegou.</h1>
        <p>
          Treino objetivo do dia a dia: achar fornecedor no PC, escrever e-mail claro, acompanhar
          entrega e conferir mercadoria. Excel entra só como apoio para comparar cotações.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('pesquisa')}>
            Começar pela pesquisa
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('email')}>
            Treinar e-mail
          </button>
          <button className="btn btn-soft" onClick={() => onNavigate('recebimento')}>
            Treinar conferência
          </button>
        </div>
        <p style={{ marginTop: '1rem', color: 'rgba(242,245,247,0.75)' }}>
          Prontidão: <strong>{percent}%</strong> — {readiness.label}
        </p>
      </section>

      <h2 className="section-title">O que o dia pede</h2>
      <div className="cards">
        {SKILLS.map((id) => (
          <div key={id} className="card" style={{ cursor: 'default' }}>
            <span className="eyebrow">{skillLabels[id]}</span>
            <h3 style={{ marginBottom: '0.55rem' }}>{skillScores[id] || 0}%</h3>
            <div className="progress-bar" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <span style={{ width: `${skillScores[id] || 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Módulos de prática</h2>
      <div className="cards">
        {modules.map((m) => {
          const score = skillScores[m.id] || 0
          const done = score >= 70
          return (
            <button
              key={m.id}
              type="button"
              className="card module-card-btn"
              onClick={() => onNavigate(m.id)}
            >
              <span className="eyebrow">{done ? 'Aprovado (≥70%)' : m.priority}</span>
              <h3>
                {m.icon} {m.title}
              </h3>
              <p>{m.short}</p>
              <p style={{ marginTop: '0.55rem', color: 'var(--teal)', fontWeight: 700 }}>
                Skill {score}% · Abrir prática →
              </p>
            </button>
          )
        })}
      </div>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Plano de 7 dias</h2>
        <p className="muted">
          Ordem alinhada ao cargo: pesquisa → e-mail → conferência → Excel de apoio. Marque o dia
          depois de treinar.
        </p>
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
