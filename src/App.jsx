import { useState } from 'react'
import { modules } from './data/content'
import { useProgress } from './hooks/useProgress'
import Home from './components/Home'
import ExcelModule from './components/modules/ExcelModule'
import PesquisaModule from './components/modules/PesquisaModule'
import EmailModule from './components/modules/EmailModule'
import RecebimentoModule from './components/modules/RecebimentoModule'
import MateriaisModule from './components/modules/MateriaisModule'
import MentalidadeModule from './components/modules/MentalidadeModule'
import PlanoModule from './components/modules/PlanoModule'
import SimulacaoModule from './components/modules/SimulacaoModule'

const navExtra = [
  { id: 'home', icon: '🏠', title: 'Início' },
  { id: 'plano', icon: '📅', title: 'Plano 7 dias' },
  { id: 'simulacao', icon: '🏆', title: 'Simulação final' },
]

export default function App() {
  const [view, setView] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    progress,
    percent,
    readiness,
    skillScores,
    toggleDay,
    setSkillExact,
    markExercise,
    savePesquisa,
    isModuleDone,
    reset,
  } = useProgress()

  function navigate(id) {
    setView(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const shared = { progress, setSkillExact, markExercise }

  let content = null
  if (view === 'home') {
    content = (
      <Home
        onNavigate={navigate}
        progress={progress}
        toggleDay={toggleDay}
        skillScores={skillScores}
        percent={percent}
        readiness={readiness}
      />
    )
  } else if (view === 'plano') {
    content = (
      <PlanoModule
        progress={progress}
        toggleDay={toggleDay}
        onNavigate={navigate}
        skillScores={skillScores}
      />
    )
  } else if (view === 'excel') {
    content = <ExcelModule {...shared} />
  } else if (view === 'pesquisa') {
    content = <PesquisaModule {...shared} savePesquisa={savePesquisa} />
  } else if (view === 'email') {
    content = <EmailModule {...shared} />
  } else if (view === 'recebimento') {
    content = <RecebimentoModule {...shared} />
  } else if (view === 'materiais') {
    content = <MateriaisModule {...shared} />
  } else if (view === 'mentalidade') {
    content = <MentalidadeModule {...shared} />
  } else if (view === 'simulacao') {
    content = <SimulacaoModule {...shared} />
  }

  return (
    <div className="app-shell">
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <strong>Treino Compras</strong>
          <span>Pronto para executar o básico</span>
        </div>

        <div className="nav-group">
          <div className="nav-label">Geral</div>
          {navExtra.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${view === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="nav-group">
          <div className="nav-label">Prática</div>
          {modules.map((m) => (
            <button
              key={m.id}
              className={`nav-btn ${view === m.id ? 'active' : ''}`}
              onClick={() => navigate(m.id)}
            >
              <span className="icon">{m.icon}</span>
              {m.title}
              {isModuleDone(m.id) ? ' ✓' : ` ${skillScores[m.id] || 0}%`}
            </button>
          ))}
        </div>

        <div className="progress-card">
          <h4>Prontidão</h4>
          <div className="progress-bar">
            <span style={{ width: `${percent}%` }} />
          </div>
          <p style={{ margin: '0.55rem 0 0', fontSize: '0.85rem', color: 'rgba(242,245,247,0.7)' }}>
            {percent}% · {readiness.label}
          </p>
          <button
            className="btn btn-ghost"
            style={{ marginTop: '0.7rem', width: '100%', fontSize: '0.85rem' }}
            onClick={reset}
          >
            Zerar progresso
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="mobile-top">
          <button className="btn btn-ghost" onClick={() => setMenuOpen(true)}>
            Menu
          </button>
          <strong style={{ fontFamily: 'var(--font-display)' }}>Treino Compras</strong>
        </div>
        {content}
      </main>
    </div>
  )
}
