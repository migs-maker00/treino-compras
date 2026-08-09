import { useMemo, useState } from 'react'
import { searchTips } from '../../data/content'
import { scoreSearchQuery, searchMissions } from '../../data/practice'

export default function PesquisaModule({ progress, savePesquisa, setSkillExact, markExercise }) {
  const [missionId, setMissionId] = useState(searchMissions[0].id)
  const [query, setQuery] = useState('')
  const [checked, setChecked] = useState(false)
  const [picked, setPicked] = useState(progress.pesquisaPicked || [])
  const [notes, setNotes] = useState(progress.pesquisaNotes || {})

  const mission = searchMissions.find((m) => m.id === missionId)
  const result = useMemo(() => scoreSearchQuery(query, mission), [query, mission])

  const catalog = searchMissions.map((m) => m.target)

  function persist(nextPicked, nextNotes) {
    setPicked(nextPicked)
    setNotes(nextNotes)
    savePesquisa(nextPicked, nextNotes)
  }

  function toggleProduct(p) {
    const next = picked.includes(p) ? picked.filter((x) => x !== p) : [...picked, p]
    persist(next, notes)
  }

  const notesFilled = picked.filter((p) => (notes[p] || '').trim().length >= 20).length

  return (
    <div className="panel">
      <section className="hero">
        <h1>🔎 Pesquisa de verdade</h1>
        <p>
          Treino: transformar pedido vago em busca específica — e anotar fornecedores como no trabalho.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Missão: reescreva a busca</h2>
        <div className="tabs">
          {searchMissions.map((m) => (
            <button
              key={m.id}
              className={`tab ${missionId === m.id ? 'active' : ''}`}
              onClick={() => {
                setMissionId(m.id)
                setQuery('')
                setChecked(false)
              }}
            >
              “{m.request}”
            </button>
          ))}
        </div>

        <div className="compare">
          <div className="bad">
            <strong>Pedido vago</strong>
            <p>{mission.request}</p>
          </div>
          <div className="good">
            <strong>Alvo profissional</strong>
            <p>{mission.target}</p>
          </div>
        </div>

        <h3>Sua busca</h3>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setChecked(false)
          }}
          placeholder="Digite como pesquisaria no Google / fornecedor…"
          style={{
            width: '100%',
            padding: '0.8rem 0.9rem',
            borderRadius: 12,
            border: '1px solid var(--line)',
          }}
        />
        <button
          className="btn btn-dark"
          style={{ marginTop: '0.7rem' }}
          onClick={() => {
            setChecked(true)
            if (result.passed) {
              markExercise(`pesquisa-${mission.id}`, true, 'pesquisa', 12)
              const done = searchMissions.filter((m) => progress.exerciseDone[`pesquisa-${m.id}`] || m.id === mission.id).length
              // approximate after mark
              setSkillExact('pesquisa', Math.min(100, 20 + done * 12 + (notesFilled >= 5 ? 20 : 0)))
            }
          }}
        >
          Avaliar especificações
        </button>

        {checked && (
          <div className={`feedback ${result.passed ? 'ok' : 'bad'}`}>
            Score: <strong>{result.score}/100</strong>
            <div>Componentes encontrados: {result.reqHits.join(', ') || 'nenhum'}</div>
            {!result.passed && (
              <div>Falta especificar: {result.missing.join(', ')}</div>
            )}
          </div>
        )}

        <h3>Checklist do que anotar</h3>
        <div className="term-grid">
          {searchTips.checklist.map((c) => (
            <div key={c} className="mini-card">{c}</div>
          ))}
        </div>

        <h3>Caderno de fornecedores (salva no navegador)</h3>
        <p className="muted">
          Escolha produtos e anote 3 fornecedores com preço, frete e prazo. Precisa de pelo menos 5
          anotações úteis para avançar a habilidade.
        </p>
        <div className="cat-grid">
          {catalog.map((p) => {
            const active = picked.includes(p)
            return (
              <button
                key={p}
                type="button"
                className="mini-card"
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderColor: active ? 'var(--teal)' : undefined,
                  background: active ? '#e8f7f5' : '#fff',
                }}
                onClick={() => toggleProduct(p)}
              >
                <strong>{active ? '✓ ' : ''}{p}</strong>
                {active && (
                  <textarea
                    placeholder="Forn. A/B/C — preço, frete, prazo, disponibilidade…"
                    value={notes[p] || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const next = { ...notes, [p]: e.target.value }
                      persist(picked, next)
                    }}
                    style={{
                      width: '100%',
                      marginTop: '0.55rem',
                      minHeight: 70,
                      borderRadius: 10,
                      border: '1px solid var(--line)',
                      padding: '0.5rem',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
        <p style={{ marginTop: '0.9rem' }}>
          Anotações úteis: <strong>{notesFilled}/5</strong>
        </p>
        <button
          className="btn btn-primary"
          disabled={notesFilled < 5}
          onClick={() => {
            markExercise('pesquisa-caderno', true, 'pesquisa', 0)
            setSkillExact('pesquisa', Math.max(progress.skillScores.pesquisa || 0, 75))
          }}
        >
          Validar caderno (mín. 5 anotações)
        </button>
      </div>
    </div>
  )
}
