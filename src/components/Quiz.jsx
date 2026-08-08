import { useState } from 'react'

export default function Quiz({ questions, onFinish }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const current = questions[index]

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
  }

  function goNext() {
    const gained = selected === current.answer ? 1 : 0
    const nextScore = score + gained
    const isLast = index + 1 >= questions.length

    if (isLast) {
      setFinalScore(nextScore)
      setDone(true)
      onFinish?.(nextScore, questions.length)
      return
    }

    setScore(nextScore)
    setIndex((n) => n + 1)
    setSelected(null)
  }

  if (done) {
    return (
      <div className="feedback ok">
        Resultado: <strong>{finalScore}/{questions.length}</strong>
        {finalScore === questions.length
          ? ' — excelente!'
          : finalScore >= Math.ceil(questions.length * 0.7)
            ? ' — bom caminho. Revise os erros e tente de novo.'
            : ' — revise o módulo e refaça o quiz.'}
        <div style={{ marginTop: '0.8rem' }}>
          <button
            className="btn btn-soft"
            onClick={() => {
              setIndex(0)
              setSelected(null)
              setScore(0)
              setFinalScore(0)
              setDone(false)
            }}
          >
            Refazer quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="muted" style={{ marginTop: 0 }}>
        Pergunta {index + 1} de {questions.length}
      </p>
      <h3 style={{ marginTop: 0 }}>{current.q}</h3>
      {current.options.map((opt, i) => {
        let cls = 'quiz-option'
        if (selected !== null) {
          if (i === current.answer) cls += ' correct'
          else if (i === selected) cls += ' wrong'
        }
        return (
          <button key={opt} className={cls} onClick={() => choose(i)}>
            {opt}
          </button>
        )
      })}
      {selected !== null && (
        <button className="btn btn-dark" style={{ marginTop: '0.8rem' }} onClick={goNext}>
          {index + 1 >= questions.length ? 'Ver resultado' : 'Próxima'}
        </button>
      )}
    </div>
  )
}
