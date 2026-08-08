import { useState } from 'react'
import { mindsetCases, quizMindset } from '../../data/content'
import Quiz from '../Quiz'

export default function MentalidadeModule({ markModule, setQuizScore }) {
  const [open, setOpen] = useState(mindsetCases[0].id)

  return (
    <div className="panel">
      <section className="hero">
        <h1>🧠 Pensar como comprador</h1>
        <p>
          Se você dominar isso, mesmo sem conhecer todos os produtos, aprende rápido.
          Recebeu “preciso de 30 parafusos”? Não pesquisa “parafuso” — pergunta qual parafuso.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Casos reais de mentalidade</h2>
        {mindsetCases.map((c) => {
          const isOpen = open === c.id
          return (
            <article key={c.id} className="mini-card" style={{ marginBottom: '0.7rem' }}>
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                }}
              >
                <span className="chip-warn chip">Solicitação vaga</span>
                <h3 style={{ margin: '0.5rem 0 0.25rem' }}>&ldquo;{c.request}&rdquo;</h3>
                <p className="muted" style={{ margin: 0 }}>
                  Erro comum: {c.wrong}
                </p>
              </button>
              {isOpen && (
                <div style={{ marginTop: '0.8rem' }}>
                  <strong>Perguntas que um comprador faz:</strong>
                  <ul>
                    {c.questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )
        })}

        <div className="feedback">
          <strong>Regra de ouro:</strong> menor preço ≠ necessariamente melhor fornecedor.
          Avalie preço + frete + prazo + qualidade + disponibilidade.
        </div>

        <h3>Quiz de mentalidade</h3>
        <Quiz
          questions={quizMindset}
          onFinish={(score, total) => {
            setQuizScore('mentalidade', `${score}/${total}`)
            if (score >= Math.ceil(total * 0.7)) markModule('mentalidade')
          }}
        />
      </div>
    </div>
  )
}
