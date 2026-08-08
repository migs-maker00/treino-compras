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
    toggleDay,
    markModule,
    setQuizScore,
    markCotacao,
    markSim,
    reset,
  } = useProgress()

  function navigate(id) {
    setView(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content = null
  if (view === 'home') {
    content = <Home onNavigate={navigate} progress={progress} toggleDay={toggleDay} />
  } else if (view === 'plano') {
    content = <PlanoModule progress={progress} toggleDay={toggleDay} onNavigate={navigate} />
  } else if (view === 'excel') {
    content = (
      <ExcelModule
        markModule={markModule}
        onCompleteCotacao={() => {
          markCotacao()
          markModule('excel')
        }}
      />
    )
  } else if (view === 'pesquisa') {
    content = <PesquisaModule markModule={markModule} />
  } else if (view === 'email') {
    content = <EmailModule markModule={markModule} />
  } else if (view === 'recebimento') {
    content = <RecebimentoModule markModule={markModule} />
  } else if (view === 'materiais') {
    content = <MateriaisModule markModule={markModule} setQuizScore={setQuizScore} />
  } else if (view === 'mentalidade') {
    content = <MentalidadeModule markModule={markModule} setQuizScore={setQuizScore} />
  } else if (view === 'simulacao') {
    content = <SimulacaoModule progress={progress} markSim={markSim} />
  }

  return (
    <div className="app-shell">
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <strong>Treino Compras</strong>
          <span>Preparação para o serviço</span>
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
          <div className="nav-label">Módulos</div>
          {modules.map((m) => (
            <button
              key={m.id}
              className={`nav-btn ${view === m.id ? 'active' : ''}`}
              onClick={() => navigate(m.id)}
            >
              <span className="icon">{m.icon}</span>
              {m.title}
              {progress.completedModules.includes(m.id) ? ' ✓' : ''}
            </button>
          ))}
        </div>

        <div className="progress-card">
          <h4>Progresso geral</h4>
          <div className="progress-bar">
            <span style={{ width: `${percent}%` }} />
          </div>
          <p style={{ margin: '0.55rem 0 0', fontSize: '0.85rem', color: 'rgba(242,245,247,0.7)' }}>
            {percent}% concluído
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
