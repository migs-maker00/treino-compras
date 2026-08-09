import { useRef, useState } from 'react'
import { excelPacks, publicPackUrl, verifyUploadedFile } from '../lib/excelPacks'

export default function ExcelPractice({ progress, markExercise, setSkillExact }) {
  const [activeId, setActiveId] = useState(excelPacks[0].id)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  const pack = excelPacks.find((p) => p.id === activeId)
  const doneCount = excelPacks.filter((p) => progress.exerciseDone[`xlsx-${p.id}`]).length
  const fileUrl = publicPackUrl(pack.filename)

  async function handleUpload(file) {
    if (!file) return
    setBusy(true)
    setResult(null)
    try {
      const report = await verifyUploadedFile(pack, file)
      setResult(report)
      if (report.passed) {
        markExercise(`xlsx-${pack.id}`, true, 'excel', 0)
        const next = doneCount + (progress.exerciseDone[`xlsx-${pack.id}`] ? 0 : 1)
        const score = Math.min(100, 55 + next * 15)
        setSkillExact('excel', Math.max(progress.skillScores.excel || 0, score))
      }
    } catch (err) {
      setResult({
        passed: false,
        message: `Não consegui ler o arquivo. Salve como .xlsx no Excel/Sheets e tente de novo. (${err.message})`,
      })
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="feedback" style={{ marginBottom: '1rem' }}>
        <strong>Como usar (importante):</strong>
        <ol style={{ marginBottom: 0 }}>
          <li>Clique em <strong>Baixar arquivo</strong> (link direto .xlsx).</li>
          <li>Abra o arquivo no <strong>Excel do computador</strong> (não no navegador, se possível).</li>
          <li>Se aparecer “Modo de Exibição Protegido”, clique em <strong>Habilitar Edição</strong>.</li>
          <li>Vá na aba <strong>Cotacao</strong> / <strong>Pedidos</strong> / <strong>Decisao</strong>.</li>
          <li>Digite fórmulas só nas células <strong>amarelas</strong>.</li>
          <li>Salve e envie o arquivo aqui para corrigir.</li>
        </ol>
      </div>

      <p>
        Exercícios Excel aprovados: <strong>{doneCount}/{excelPacks.length}</strong>
      </p>

      <div className="tabs">
        {excelPacks.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`tab ${activeId === p.id ? 'active' : ''}`}
            onClick={() => {
              setActiveId(p.id)
              setResult(null)
            }}
          >
            {progress.exerciseDone[`xlsx-${p.id}`] ? '✓ ' : ''}
            {p.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      <div className="mini-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
          <span className="chip">{pack.level}</span>
          <span className="chip">{pack.time}</span>
          <span className="chip-ok chip">Arquivo editável</span>
        </div>
        <h3 style={{ margin: '0 0 0.4rem' }}>{pack.title}</h3>
        <p className="muted" style={{ marginTop: 0 }}>{pack.summary}</p>
        <ol>
          {pack.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="muted" style={{ marginBottom: 0 }}>
          Arquivo: <code>{pack.filename}</code>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <a
          className="btn btn-primary"
          href={fileUrl}
          download={pack.filename}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            setResult({
              passed: null,
              message:
                'Download iniciado. Abra no Excel do PC → Habilitar Edição → aba de exercício → células amarelas.',
            })
          }
        >
          1. Baixar arquivo (.xlsx)
        </a>
        <button
          type="button"
          className="btn btn-dark"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Corrigindo…' : '2. Enviar planilha preenchida'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>

      <div className="mini-card" style={{ marginTop: '1rem' }}>
        <strong>Se ainda não deixar editar</strong>
        <ul style={{ marginBottom: 0 }}>
          <li>Feche o Excel, clique com o botão direito no arquivo baixado → Propriedades → marque <strong>Desbloquear</strong> (se aparecer) → Aplicar.</li>
          <li>Evite abrir só no preview do navegador/e-mail; abra no app Excel.</li>
          <li>No Excel: Arquivo → Informações → veja se não está como “Somente leitura”.</li>
          <li>Use a aba correta do exercício (não a de Instruções).</li>
        </ul>
      </div>

      {result && (
        <div
          className={`feedback ${result.passed === true ? 'ok' : result.passed === false ? 'bad' : ''}`}
          style={{ marginTop: '0.9rem' }}
        >
          {result.score != null && result.passed !== null && (
            <div>
              <strong>Score:</strong> {result.score}%
            </div>
          )}
          <div>{result.message}</div>
          {result.details?.length > 0 && (
            <ul>
              {result.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mini-card" style={{ marginTop: '1rem' }}>
        <strong>Google Sheets</strong>
        <ol style={{ marginBottom: 0 }}>
          <li>Faça upload do .xlsx no Drive e abra com Sheets</li>
          <li>Preencha as fórmulas nas células amarelas</li>
          <li>Arquivo → Fazer download → Microsoft Excel (.xlsx)</li>
          <li>Envie esse arquivo no botão 2</li>
        </ol>
      </div>
    </div>
  )
}
