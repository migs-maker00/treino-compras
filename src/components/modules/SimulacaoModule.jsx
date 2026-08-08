import { useState } from 'react'
import { simulationProducts } from '../../data/content'

function money(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function SimulacaoModule({ progress, markSim }) {
  const [active, setActive] = useState(simulationProducts[0].id)
  const [choice, setChoice] = useState(null)
  const [step, setStep] = useState(1)
  const current = simulationProducts.find((p) => p.id === active)
  const selected = current.suppliers.find((s) => s.key === choice)

  function resetCase(id) {
    setActive(id)
    setChoice(null)
    setStep(1)
  }

  return (
    <div className="panel">
      <section className="hero">
        <h1>🏆 Simulação do trabalho</h1>
        <p>
          Junte tudo: entender o pedido, comparar fornecedores, escolher a melhor compra e pensar
          na conferência. Menor preço nem sempre ganha.
        </p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          {simulationProducts.map((p) => (
            <button
              key={p.id}
              className={`tab ${active === p.id ? 'active' : ''}`}
              onClick={() => resetCase(p.id)}
            >
              {p.produto}
              {progress.simDone[p.id] ? ' ✓' : ''}
            </button>
          ))}
        </div>

        <div className="mini-card" style={{ marginBottom: '1rem' }}>
          <span className="chip">Situação</span>
          <h3 style={{ margin: '0.5rem 0' }}>{current.pedido}</h3>
          <p className="muted" style={{ margin: 0 }}>
            Especificações a confirmar: {current.specsNeeded.join(' · ')}
          </p>
        </div>

        <div className="tabs">
          {[1, 2, 3].map((s) => (
            <button key={s} className={`tab ${step === s ? 'active' : ''}`} onClick={() => setStep(s)}>
              Passo {s}
            </button>
          ))}
        </div>

        {step === 1 && (
          <>
            <h3>1. Entenda o pedido</h3>
            <p>Antes de pesquisar, liste o que ainda falta saber. Depois avance.</p>
            <ul>
              {current.specsNeeded.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <button className="btn btn-dark" onClick={() => setStep(2)}>
              Ir para cotações
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>2. Compare fornecedores</h3>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Frete</th>
                    <th>Total</th>
                    <th>Prazo</th>
                    <th>Qualidade</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {current.suppliers.map((s) => (
                    <tr key={s.key}>
                      <td>{s.nome}</td>
                      <td>{s.produto}</td>
                      <td>{money(s.preco)}</td>
                      <td>{s.frete === 0 ? 'Grátis' : money(s.frete)}</td>
                      <td>
                        <strong>{money(s.preco + s.frete)}</strong>
                      </td>
                      <td>{s.prazo} dia(s)</td>
                      <td>
                        <span
                          className={`chip ${
                            s.qualidade === 'Errada'
                              ? 'chip-bad'
                              : s.qualidade === 'Ótima'
                                ? 'chip-ok'
                                : ''
                          }`}
                        >
                          {s.qualidade}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn ${choice === s.key ? 'btn-primary' : 'btn-soft'}`}
                          onClick={() => setChoice(s.key)}
                        >
                          Escolher {s.key}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-dark"
              style={{ marginTop: '0.9rem' }}
              disabled={!choice}
              onClick={() => setStep(3)}
            >
              Ver avaliação da escolha
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>3. Decisão e conferência</h3>
            {choice ? (
              <div className={`feedback ${choice === current.best ? 'ok' : 'bad'}`}>
                Sua escolha: opção <strong>{choice}</strong>.
                <br />
                Gabarito: opção <strong>{current.best}</strong>.
                <br />
                {current.reason}
              </div>
            ) : (
              <div className="feedback bad">Volte ao passo 2 e escolha um fornecedor.</div>
            )}
            <p style={{ marginTop: '1rem' }}>
              Depois da compra: conferir produto, quantidade, especificação, estado, NF e pedido.
            </p>
            {selected && (
              <p className="muted">
                Você selecionou {selected.nome} — total {money(selected.preco + selected.frete)}.
              </p>
            )}
            {choice === current.best && (
              <button className="btn btn-primary" onClick={() => markSim(current.id)}>
                Marcar esta simulação como concluída
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
