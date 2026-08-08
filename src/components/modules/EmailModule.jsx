import { useState } from 'react'
import { emailTemplates, glossary } from '../../data/content'

export default function EmailModule({ markModule }) {
  const [active, setActive] = useState(emailTemplates[0].id)
  const [draft, setDraft] = useState('')
  const [feedback, setFeedback] = useState(null)
  const current = emailTemplates.find((t) => t.id === active)

  function evaluate() {
    const text = draft.toLowerCase()
    const checks = [
      { ok: /cotação|orcamento|orçamento|pedido|entrega|status/.test(text), label: 'Objetivo claro no texto' },
      { ok: /preço|prazo|dispon|pagamento|confirma/.test(text), label: 'Pediu informações úteis' },
      { ok: text.length > 80, label: 'Texto com tamanho suficiente' },
      { ok: /obrigad|atenciosamente|bom dia|boa tarde/.test(text), label: 'Tom profissional' },
    ]
    const score = checks.filter((c) => c.ok).length
    setFeedback({ score, checks })
  }

  return (
    <div className="panel">
      <section className="hero">
        <h1>📧 E-mail profissional</h1>
        <p>Não precisa escrever “bonito”. Precisa escrever claro: o que quer, o que é o item, o que o fornecedor deve responder.</p>
      </section>

      <div className="light-panel">
        <div className="tabs">
          {emailTemplates.map((t) => (
            <button
              key={t.id}
              className={`tab ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.title}
            </button>
          ))}
        </div>

        <p>
          <strong>Assunto:</strong> {current.subject}
        </p>
        <div className="email-box">{current.body}</div>

        <h3>Treine você mesmo</h3>
        <p className="muted">Reescreva um e-mail com suas palavras (ou adapte o modelo).</p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escreva aqui seu e-mail…"
          style={{
            width: '100%',
            minHeight: 160,
            borderRadius: 12,
            border: '1px solid var(--line)',
            padding: '0.85rem',
          }}
        />
        <div style={{ marginTop: '0.7rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-dark" onClick={evaluate}>
            Avaliar meu texto
          </button>
          <button className="btn btn-soft" onClick={() => setDraft(current.body)}>
            Copiar modelo para editar
          </button>
        </div>
        {feedback && (
          <div className={`feedback ${feedback.score >= 3 ? 'ok' : 'bad'}`}>
            Pontuação: {feedback.score}/4
            <ul>
              {feedback.checks.map((c) => (
                <li key={c.label}>
                  {c.ok ? '✓' : '✗'} {c.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <h3>Termos que você precisa reconhecer</h3>
        <div className="term-grid">
          {glossary.map((g) => (
            <article key={g.term} className="mini-card">
              <strong>{g.term}</strong>
              <p className="muted" style={{ margin: '0.35rem 0 0' }}>
                {g.def}
              </p>
            </article>
          ))}
        </div>

        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => markModule('email')}>
          Marcar módulo E-mail como estudado
        </button>
      </div>
    </div>
  )
}
