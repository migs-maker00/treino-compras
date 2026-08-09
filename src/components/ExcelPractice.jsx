import { useRef, useState } from 'react'
import { downloadPack, excelPacks, verifyUploadedFile } from '../lib/excelPacks'

export default function ExcelPractice({ progress, markExercise, setSkillExact }) {
  const [activeId, setActiveId] = useState(excelPacks[0].id)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  const pack = excelPacks.find((p) => p.id === activeId)
  const doneCount = excelPacks.filter((p) => progress.exerciseDone[`xlsx-${p.id}`]).length

  async function handleDownload() {
    setBusy(true)
    setResult(null)
    try {
      await downloadPack(pack)
      setResult({
        passed: null,
        message: 'Arquivo baixado. Abra no Excel, preencha as células amarelas, salve e envie aqui.',
      })
    } catch (err) {
      setResult({ passed: false, message: `Falha ao gerar arquivo: ${err.message}` })
    } finally {
      setBusy(false)
    }
  }

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
        <strong>Fluxo:</strong> Baixar → abrir no Excel → preencher células amarelas com fórmulas →
        salvar .xlsx → enviar para correção. Também funciona no Google Sheets (baixe de volta como Excel).
      </div>

      <p>
        Exercícios Excel aprovados: <strong>{doneCount}/{excelPacks.length}</strong>
      </p>

      <div className="tabs">
        {excelPacks.map((p) => (
          <button
            key={p.id}
            className={`tab ${activeId === p.id ? 'active' : ''}`}
            onClick={() => {
              setActiveId(p.id)
              setResult(null)
            }}
          >
            {progress.exerciseDone[`xlsx-${p.id}`] ? '✓ ' : ''}{p.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      <div className="mini-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
          <span className="chip">{pack.level}</span>
          <span className="chip">{pack.time}</span>
        </div>
        <h3 style={{ margin: '0 0 0.4rem' }}>{pack.title}</h3>
        <p className="muted" style={{ marginTop: 0 }}>{pack.summary}</p>
        <ol>
          {pack.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" disabled={busy} onClick={handleDownload}>
          {busy ? 'Gerando…' : '1. Baixar exercício (.xlsx)'}
        </button>
        <button
          className="btn btn-dark"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          2. Enviar planilha preenchida
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hidden
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>

      {result && (
        <div
          className={`feedback ${result.passed === true ? 'ok' : result.passed === false ? 'bad' : ''}`}
          style={{ marginTop: '0.9rem' }}
        >
          {result.score != null && result.passed !== null && (
            <div><strong>Score:</strong> {result.score}%</div>
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
        <strong>Se usar Google Sheets</strong>
        <ol style={{ marginBottom: 0 }}>
          <li>Abra o arquivo baixado no Sheets</li>
          <li>Preencha as fórmulas</li>
          <li>Arquivo → Fazer download → Microsoft Excel (.xlsx)</li>
          <li>Envie esse arquivo aqui</li>
        </ol>
      </div>
    </div>
  )
}
