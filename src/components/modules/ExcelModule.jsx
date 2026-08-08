import { useState } from 'react'
import { excelBasics, excelFormulas } from '../../data/content'
import CotacaoSimulator from '../CotacaoSimulator'

export default function ExcelModule({ onCompleteCotacao, markModule }) {
  const [tab, setTab] = useState('basico')

  return (
    <div className="panel">
      <section className="hero">
        <h1>🖥️ Excel — prioridade nº 1</h1>
        <p>
          Não precisa programar. Domine organização, filtros e poucas fórmulas.
          PROCV/PROCX e uma planilha de cotação já te colocam à frente.
        </p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          {[
            ['basico', 'Básico'],
            ['formulas', 'Fórmulas'],
            ['cotacao', 'Simulador de cotação'],
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
            <h2 style={{ marginTop: 0 }}>O que aprender primeiro</h2>
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
            <button className="btn btn-dark" style={{ marginTop: '1rem' }} onClick={() => markModule('excel')}>
              Marcar módulo Excel como estudado
            </button>
          </>
        )}

        {tab === 'formulas' && (
          <>
            <h2 style={{ marginTop: 0 }}>Fórmulas essenciais</h2>
            <div className="formula-grid">
              {excelFormulas.map((f) => (
                <article key={f.name} className="mini-card">
                  <code>{f.name}</code>
                  <p style={{ margin: '0.2rem 0' }}>{f.use}</p>
                  <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                    Ex.: {f.example}
                  </p>
                </article>
              ))}
            </div>
            <div className="feedback" style={{ marginTop: '1rem' }}>
              <strong>FOCO:</strong> PROCV / PROCX — relacionar código do produto com fornecedor e preço sem copiar na mão.
            </div>
          </>
        )}

        {tab === 'cotacao' && (
          <>
            <h2 style={{ marginTop: 0 }}>Exercício: COTAÇÃO DE FORNECEDORES</h2>
            <p className="muted">
              Edite preços e fornecedores. A coluna “Melhor preço” recalcula sozinha — no Excel isso seria
              <code> =MÍNIMO()</code> ou <code>=SE()</code>.
            </p>
            <CotacaoSimulator onComplete={onCompleteCotacao} />
          </>
        )}
      </div>
    </div>
  )
}
