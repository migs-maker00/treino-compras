import { useMemo, useState } from 'react'
import { cotacaoRows, supplierScore } from '../data/practice'

function money(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CotacaoSimulator({ onPass }) {
  const [choices, setChoices] = useState({})
  const [checked, setChecked] = useState(false)

  const rows = useMemo(
    () =>
      cotacaoRows.map((r) => {
        const options = ['a', 'b', 'c'].map((key) => {
          const s = r[key]
          return {
            key,
            ...s,
            total: s.preco + s.frete,
            score: supplierScore(s),
          }
        })
        return { ...r, options }
      }),
    [],
  )

  const result = useMemo(() => {
    let correct = 0
    const details = rows.map((r) => {
      const pick = choices[r.produto]
      const ok = pick === r.best
      if (ok) correct += 1
      return { produto: r.produto, pick, ok, reason: r.reason, best: r.best }
    })
    return { correct, total: rows.length, passed: correct === rows.length, details }
  }, [choices, rows])

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
        <span className="chip">Preço + frete + prazo + qualidade + disponibilidade</span>
        <span className="chip-warn chip">Menor preço ≠ melhor compra</span>
      </div>

      <p className="muted">
        Para cada item, escolha o fornecedor. Depois clique em <strong>Verificar decisões</strong>.
        Só conclui se acertar todos.
      </p>

      {rows.map((r) => (
        <div key={r.produto} className="mini-card" style={{ marginBottom: '0.85rem' }}>
          <strong>{r.produto}</strong> <span className="muted">· qtd {r.qtd}</span>
          <div className="table-wrap" style={{ marginTop: '0.6rem' }}>
            <table className="data">
              <thead>
                <tr>
                  <th>Opção</th>
                  <th>Fornecedor</th>
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
                {r.options.map((s) => (
                  <tr key={s.key}>
                    <td>{s.key.toUpperCase()}</td>
                    <td>
                      {s.nome}
                      {s.obs ? <div className="muted" style={{ fontSize: '0.8rem' }}>{s.obs}</div> : null}
                    </td>
                    <td>{money(s.preco)}</td>
                    <td>{s.frete === 0 ? 'Grátis' : money(s.frete)}</td>
                    <td><strong>{money(s.total)}</strong></td>
                    <td>{s.prazo}d</td>
                    <td>{'★'.repeat(s.qualidade)}{'☆'.repeat(5 - s.qualidade)}</td>
                    <td>
                      <span className={`chip ${s.disponivel ? 'chip-ok' : 'chip-bad'}`}>
                        {s.disponivel ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn ${choices[r.produto] === s.key ? 'btn-primary' : 'btn-soft'}`}
                        onClick={() => {
                          setChoices((c) => ({ ...c, [r.produto]: s.key }))
                          setChecked(false)
                        }}
                      >
                        Escolher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <button
        className="btn btn-dark"
        disabled={Object.keys(choices).length < rows.length}
        onClick={() => {
          setChecked(true)
          if (result.passed) onPass?.(100)
        }}
      >
        Verificar decisões
      </button>

      {checked && (
        <div className={`feedback ${result.passed ? 'ok' : 'bad'}`} style={{ marginTop: '0.9rem' }}>
          {result.passed ? (
            <>Aprovado: {result.correct}/{result.total}. Você considerou o conjunto, não só o preço.</>
          ) : (
            <>
              {result.correct}/{result.total} corretas. Revise:
              <ul>
                {result.details
                  .filter((d) => !d.ok)
                  .map((d) => (
                    <li key={d.produto}>
                      <strong>{d.produto}</strong>: melhor era {d.best.toUpperCase()}. {d.reason}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      )}

      {checked && result.passed && (
        <p className="chip-ok chip" style={{ marginTop: '0.8rem' }}>
          Exercício de cotação concluído por mérito
        </p>
      )}
    </div>
  )
}
