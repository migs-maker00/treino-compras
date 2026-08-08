import { useMemo, useState } from 'react'
import { searchTips } from '../../data/content'

const products = [
  'mangueira hidráulica 1/2" alta pressão 10 metros',
  'parafuso sextavado inox M8 x 50 mm',
  'luva nitrílica tamanho G sem pó',
  'disco de corte 4.1/2" para inox',
  'cabo elétrico 2,5 mm² flexível 100m',
  'abraçadeira inox 1/2"',
  'óculos de proteção incolor',
  'disjuntor bipolar 20A',
  'chave combinada 13 mm CR-V',
  'selante PU cinza 400g',
]

export default function PesquisaModule({ markModule }) {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState([])
  const [notes, setNotes] = useState({})

  const tip = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    if (q.split(/\s+/).length <= 1) {
      return {
        type: 'bad',
        text: 'Muito genérico. Acrescente tipo, medida, material ou norma.',
      }
    }
    if (q.length < 18) {
      return {
        type: 'warn',
        text: 'Melhorando… ainda dá para especificar mais (pressão, tamanho, material).',
      }
    }
    return {
      type: 'ok',
      text: 'Boa pesquisa: específica o suficiente para achar o item certo.',
    }
  }, [query])

  function toggleProduct(p) {
    setPicked((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  return (
    <div className="panel">
      <section className="hero">
        <h1>🔎 Pesquisa e cotação de fornecedores</h1>
        <p>
          Seu chefe falou em “ficar pesquisando no PC fornecedores”. Isso é habilidade profissional:
          especificar bem, comparar e decidir.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Pesquise como profissional</h2>
        <div className="compare">
          <div className="bad">
            <strong>Evite</strong>
            <ul>
              {searchTips.bad.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="good">
            <strong>Prefira</strong>
            <ul>
              {searchTips.good.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        <h3>Treino rápido de busca</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Digite como você pesquisaria… ex: mangueira hidráulica 1/2"'
          style={{
            width: '100%',
            padding: '0.8rem 0.9rem',
            borderRadius: 12,
            border: '1px solid var(--line)',
          }}
        />
        {tip && (
          <div className={`feedback ${tip.type === 'ok' ? 'ok' : tip.type === 'bad' ? 'bad' : ''}`}>
            {tip.text}
          </div>
        )}

        <h3>Checklist do que anotar</h3>
        <div className="term-grid">
          {searchTips.checklist.map((c) => (
            <div key={c} className="mini-card">
              {c}
            </div>
          ))}
        </div>

        <h3>Exercício do Dia 3</h3>
        <p className="muted">
          Escolha 10 produtos. Para cada um, anote 3 fornecedores (pode pesquisar de verdade no Google
          depois). Aqui você marca e registra o melhor.
        </p>
        <div className="cat-grid">
          {products.map((p) => {
            const active = picked.includes(p)
            return (
              <button
                key={p}
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
                    placeholder="Fornecedor A / B / C — preço, frete, prazo…"
                    value={notes[p] || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setNotes((n) => ({ ...n, [p]: e.target.value }))}
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
          Selecionados: <strong>{picked.length}/10</strong>
        </p>
        <button className="btn btn-dark" onClick={() => markModule('pesquisa')}>
          Marcar módulo Pesquisa como estudado
        </button>
      </div>
    </div>
  )
}
