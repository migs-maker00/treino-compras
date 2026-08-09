import { useMemo, useState } from 'react'
import { simulationProducts } from '../../data/content'
import { dayMissions, dayMissingLabels, cotacaoRows, supplierScore } from '../../data/practice'

function money(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function SimulacaoModule({ progress, setSkillExact, markExercise }) {
  const [mode, setMode] = useState('dia')
  const [missionIdx, setMissionIdx] = useState(0)
  const [pickedMissing, setPickedMissing] = useState([])
  const [missingChecked, setMissingChecked] = useState(false)
  const [supplierPick, setSupplierPick] = useState(null)
  const [supplierChecked, setSupplierChecked] = useState(false)
  const [caseId, setCaseId] = useState(simulationProducts[0].id)
  const [choice, setChoice] = useState(null)
  const [step, setStep] = useState(1)

  const mission = dayMissions[missionIdx]
  const allMissingOptions = [...mission.missing, ...mission.distractors]
  const missingOk = useMemo(() => {
    const set = new Set(pickedMissing)
    const hit = mission.missing.every((m) => set.has(m))
    const bad = mission.distractors.some((d) => set.has(d))
    return hit && !bad && pickedMissing.length === mission.missing.length
  }, [pickedMissing, mission])

  const quote = cotacaoRows[missionIdx % cotacaoRows.length]
  const quoteOptions = ['a', 'b', 'c'].map((k) => ({ key: k, ...quote[k], total: quote[k].preco + quote[k].frete, score: supplierScore(quote[k]) }))
  const supplierOk = supplierPick === quote.best

  const current = simulationProducts.find((p) => p.id === caseId)

  function finishDaySlice() {
    if (missingOk && supplierOk) {
      markExercise(`day-${mission.id}`, true, 'simulacao', 0)
      const count = dayMissions.filter(
        (m) => progress.exerciseDone[`day-${m.id}`] || m.id === mission.id,
      ).length
      const classic = Object.keys(progress.exerciseDone).filter((k) => k.startsWith('sim-')).length
      setSkillExact('simulacao', Math.min(100, Math.round(((count + classic) / (dayMissions.length + 3)) * 100)))
    }
  }

  return (
    <div className="panel">
      <section className="hero">
        <h1>🏆 Simulação de trabalho</h1>
        <p>
          Um dia de compras: pedido vago → perguntas → cotação → decisão. Depois refine nos casos clássicos.
        </p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          <button className={`tab ${mode === 'dia' ? 'active' : ''}`} onClick={() => setMode('dia')}>
            Dia de trabalho
          </button>
          <button className={`tab ${mode === 'classic' ? 'active' : ''}`} onClick={() => setMode('classic')}>
            Casos clássicos
          </button>
        </div>

        {mode === 'dia' && (
          <>
            <div className="tabs">
              {dayMissions.map((m, i) => (
                <button
                  key={m.id}
                  className={`tab ${missionIdx === i ? 'active' : ''}`}
                  onClick={() => {
                    setMissionIdx(i)
                    setPickedMissing([])
                    setMissingChecked(false)
                    setSupplierPick(null)
                    setSupplierChecked(false)
                  }}
                >
                  {progress.exerciseDone[`day-${m.id}`] ? '✓ ' : ''}{m.hour}
                </button>
              ))}
            </div>

            <div className="mini-card">
              <span className="chip">{mission.hour} · {mission.channel}</span>
              <h3 style={{ margin: '0.5rem 0' }}>&ldquo;{mission.text}&rdquo;</h3>
            </div>

            <h3>1. O que está faltando no pedido?</h3>
            <p className="muted">Marque só o essencial (ignore distrações).</p>
            {allMissingOptions.map((id) => (
              <label key={id} className="check-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={pickedMissing.includes(id)}
                  onChange={() => {
                    setPickedMissing((prev) =>
                      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                    )
                    setMissingChecked(false)
                  }}
                />
                <span>{dayMissingLabels[id] || id}</span>
              </label>
            ))}
            <button
              className="btn btn-dark"
              style={{ marginTop: '0.6rem' }}
              onClick={() => setMissingChecked(true)}
            >
              Verificar perguntas
            </button>
            {missingChecked && (
              <div className={`feedback ${missingOk ? 'ok' : 'bad'}`}>
                {missingOk
                  ? 'Boa: você isolou o que importa.'
                  : `Revise. Essencial: ${mission.missing.map((m) => dayMissingLabels[m]).join(', ')}`}
              </div>
            )}

            <h3>2. Escolha o fornecedor</h3>
            <p className="muted">Produto simulado: {quote.produto}</p>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Forn.</th>
                    <th>Preço</th>
                    <th>Frete</th>
                    <th>Total</th>
                    <th>Prazo</th>
                    <th>Qualidade</th>
                    <th>Estoque</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quoteOptions.map((s) => (
                    <tr key={s.key}>
                      <td>
                        {s.nome}
                        {s.obs ? <div className="muted" style={{ fontSize: '0.8rem' }}>{s.obs}</div> : null}
                      </td>
                      <td>{money(s.preco)}</td>
                      <td>{s.frete === 0 ? 'Grátis' : money(s.frete)}</td>
                      <td><strong>{money(s.total)}</strong></td>
                      <td>{s.prazo}d</td>
                      <td>{s.qualidade}/5</td>
                      <td>{s.disponivel ? 'Sim' : 'Não'}</td>
                      <td>
                        <button
                          className={`btn ${supplierPick === s.key ? 'btn-primary' : 'btn-soft'}`}
                          onClick={() => {
                            setSupplierPick(s.key)
                            setSupplierChecked(false)
                          }}
                        >
                          Escolher {s.key.toUpperCase()}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-dark"
              style={{ marginTop: '0.7rem' }}
              disabled={!supplierPick}
              onClick={() => {
                setSupplierChecked(true)
                finishDaySlice()
              }}
            >
              Confirmar decisão do dia
            </button>
            {supplierChecked && (
              <div className={`feedback ${supplierOk && missingOk ? 'ok' : 'bad'}`}>
                {supplierOk && missingOk
                  ? `Caso do dia aprovado. ${quote.reason}`
                  : !missingOk
                    ? 'Primeiro acerte o que falta no pedido.'
                    : `Fornecedor ideal: ${quote.best.toUpperCase()}. ${quote.reason}`}
              </div>
            )}
          </>
        )}

        {mode === 'classic' && (
          <>
            <div className="tabs">
              {simulationProducts.map((p) => (
                <button
                  key={p.id}
                  className={`tab ${caseId === p.id ? 'active' : ''}`}
                  onClick={() => {
                    setCaseId(p.id)
                    setChoice(null)
                    setStep(1)
                  }}
                >
                  {progress.exerciseDone[`sim-${p.id}`] ? '✓ ' : ''}{p.produto}
                </button>
              ))}
            </div>

            <div className="mini-card" style={{ marginBottom: '1rem' }}>
              <span className="chip">Situação</span>
              <h3 style={{ margin: '0.5rem 0' }}>{current.pedido}</h3>
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
                <ul>
                  {current.specsNeeded.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <button className="btn btn-dark" onClick={() => setStep(2)}>Ir para cotações</button>
              </>
            )}

            {step === 2 && (
              <>
                <h3>2. Compare</h3>
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
                          <td><strong>{money(s.preco + s.frete)}</strong></td>
                          <td>{s.prazo}d</td>
                          <td>{s.qualidade}</td>
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
                <button className="btn btn-dark" style={{ marginTop: '0.8rem' }} disabled={!choice} onClick={() => setStep(3)}>
                  Avaliar
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <h3>3. Decisão</h3>
                {choice ? (
                  <div className={`feedback ${choice === current.best ? 'ok' : 'bad'}`}>
                    Sua escolha: {choice}. Gabarito: {current.best}. {current.reason}
                  </div>
                ) : (
                  <div className="feedback bad">Escolha um fornecedor no passo 2.</div>
                )}
                {choice === current.best && (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '0.8rem' }}
                    onClick={() => {
                      markExercise(`sim-${current.id}`, true, 'simulacao', 0)
                      const classic = simulationProducts.filter(
                        (p) => progress.exerciseDone[`sim-${p.id}`] || p.id === current.id,
                      ).length
                      const days = dayMissions.filter((m) => progress.exerciseDone[`day-${m.id}`]).length
                      setSkillExact('simulacao', Math.min(100, Math.round(((classic + days) / (simulationProducts.length + dayMissions.length)) * 100)))
                    }}
                  >
                    Registrar acerto
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
