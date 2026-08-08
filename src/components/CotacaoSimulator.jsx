import { useMemo, useState } from 'react'
import { cotacaoSeed } from '../data/content'

function money(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CotacaoSimulator({ onComplete }) {
  const [rows, setRows] = useState(
    cotacaoSeed.map((r) => ({
      ...r,
      p1: String(r.p1),
      p2: String(r.p2),
    })),
  )
  const [showHelp, setShowHelp] = useState(false)

  const computed = useMemo(
    () =>
      rows.map((r) => {
        const p1 = Number(String(r.p1).replace(',', '.')) || 0
        const p2 = Number(String(r.p2).replace(',', '.')) || 0
        const best = Math.min(p1, p2)
        const winner = p1 === p2 ? 'Empate' : p1 < p2 ? r.f1 : r.f2
        const totalBest = best * r.qtd
        return { ...r, p1n: p1, p2n: p2, best, winner, totalBest }
      }),
    [rows],
  )

  const totals = useMemo(() => {
    const t1 = computed.reduce((s, r) => s + r.p1n * r.qtd, 0)
    const t2 = computed.reduce((s, r) => s + r.p2n * r.qtd, 0)
    const tBest = computed.reduce((s, r) => s + r.totalBest, 0)
    return { t1, t2, tBest }
  }, [computed])

  function update(i, field, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
        <span className="chip">20 produtos</span>
        <span className="chip">Melhor preço automático</span>
        <button className="btn btn-soft" onClick={() => setShowHelp((v) => !v)}>
          {showHelp ? 'Ocultar dica PROCV' : 'Ver dica PROCV'}
        </button>
      </div>

      {showHelp && (
        <div className="feedback" style={{ marginBottom: '1rem' }}>
          <strong>No Excel real</strong>, você pode ter uma aba de produtos e outra de preços.
          Com <code>=PROCV(código; tabela; coluna; FALSO)</code> ou <code>=PROCX(...)</code>,
          o Excel busca o preço pelo código automaticamente — como esta coluna “Melhor preço” faz aqui.
        </div>
      )}

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Especificação</th>
              <th>Qtd</th>
              <th>Fornecedor 1</th>
              <th>Preço 1</th>
              <th>Fornecedor 2</th>
              <th>Preço 2</th>
              <th>Melhor preço</th>
              <th>Vencedor</th>
              <th>Total melhor</th>
            </tr>
          </thead>
          <tbody>
            {computed.map((r, i) => (
              <tr key={r.produto} className={r.p1n !== r.p2n ? 'best-row' : ''}>
                <td>{r.produto}</td>
                <td>{r.spec}</td>
                <td>{r.qtd}</td>
                <td>
                  <input value={r.f1} onChange={(e) => update(i, 'f1', e.target.value)} />
                </td>
                <td>
                  <input value={r.p1} onChange={(e) => update(i, 'p1', e.target.value)} />
                </td>
                <td>
                  <input value={r.f2} onChange={(e) => update(i, 'f2', e.target.value)} />
                </td>
                <td>
                  <input value={r.p2} onChange={(e) => update(i, 'p2', e.target.value)} />
                </td>
                <td>
                  <strong>{money(r.best)}</strong>
                </td>
                <td>{r.winner}</td>
                <td>{money(r.totalBest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cards" style={{ marginTop: '1rem' }}>
        <div className="mini-card">
          <strong>Total Fornecedor 1 (misturado)</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0' }}>
            Soma se comprasse só preço 1 de cada linha: {money(totals.t1)}
          </p>
        </div>
        <div className="mini-card">
          <strong>Total Fornecedor 2 (misturado)</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0' }}>
            Soma se comprasse só preço 2 de cada linha: {money(totals.t2)}
          </p>
        </div>
        <div className="mini-card">
          <strong>Melhor combinação</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0' }}>
            Escolhendo o menor preço de cada item: {money(totals.tBest)}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button
          className="btn btn-primary"
          onClick={() => onComplete?.()}
        >
          Marcar exercício de cotação como concluído
        </button>
      </div>
    </div>
  )
}
