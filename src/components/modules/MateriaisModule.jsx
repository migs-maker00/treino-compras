import { materialCategories, quizMaterials } from '../../data/content'
import Quiz from '../Quiz'

export default function MateriaisModule({ markModule, setQuizScore }) {
  return (
    <div className="panel">
      <section className="hero">
        <h1>⚓ Materiais e categorias</h1>
        <p>
          Você não precisa virar especialista naval. Reconhecer categorias — ferragens, hidráulica,
          elétrica, EPI, consumíveis — já é uma vantagem enorme.
        </p>
      </section>

      <div className="light-panel">
        <h2 style={{ marginTop: 0 }}>Catálogo base</h2>
        <div className="cat-grid">
          {materialCategories.map((cat) => (
            <article key={cat.id} className="mini-card">
              <h3 style={{ margin: '0 0 0.5rem' }}>
                {cat.icon} {cat.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {cat.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <h3>Quiz de categorias</h3>
        <Quiz
          questions={quizMaterials}
          onFinish={(score, total) => {
            setQuizScore('materiais', `${score}/${total}`)
            if (score >= Math.ceil(total * 0.7)) markModule('materiais')
          }}
        />
      </div>
    </div>
  )
}
