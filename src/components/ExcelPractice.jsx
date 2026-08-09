import { useRef, useState } from 'react'
import { excelPacks, publicPackUrl, verifyUploadedFile } from '../lib/excelPacks'
import BrowserSheet from './BrowserSheet'

export default function ExcelPractice({ progress, markExercise, setSkillExact }) {
  const [mode, setMode] = useState('browser') // browser | arquivo
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
        message: `Não consegui ler o arquivo. (${err.message})`,
      })
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="feedback" style={{ marginBottom: '1rem' }}>
        <strong>Não precisa de chave do Excel.</strong> O Office bloqueia edição sem licença.
        Use a planilha do site (recomendado) ou o Google Sheets (grátis).
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${mode === 'browser' ? 'active' : ''}`}
          onClick={() => setMode('browser')}
        >
          Planilha no navegador (grátis)
        </button>
        <button
          type="button"
          className={`tab ${mode === 'arquivo' ? 'active' : ''}`}
          onClick={() => setMode('arquivo')}
        >
          Arquivo .xlsx (Excel/Sheets)
        </button>
      </div>

      {mode === 'browser' && (
        <BrowserSheet
          progress={progress}
          markExercise={markExercise}
          setSkillExact={setSkillExact}
        />
      )}

      {mode === 'arquivo' && (
        <>
          <div className="mini-card" style={{ marginBottom: '1rem' }}>
            <strong>Opções sem pagar Excel</strong>
            <ol style={{ marginBottom: 0 }}>
              <li>
                <a href="https://sheets.google.com" target="_blank" rel="noreferrer">
                  Google Sheets
                </a>
                : envie o .xlsx para o Drive → abra com Sheets → edite → baixe de novo como Excel.
              </li>
              <li>
                <a href="https://www.microsoft.com/pt-br/microsoft-365/free-office-online-for-the-web" target="_blank" rel="noreferrer">
                  Excel na Web
                </a>
                {' '}(conta Microsoft) — versão online.
              </li>
              <li>LibreOffice Calc (programa grátis para PC).</li>
            </ol>
          </div>

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
            <h3 style={{ marginTop: 0 }}>{pack.title}</h3>
            <p className="muted">{pack.summary}</p>
            <ol>
              {pack.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href={fileUrl} download={pack.filename}>
              Baixar .xlsx
            </a>
            <button
              type="button"
              className="btn btn-dark"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? 'Corrigindo…' : 'Enviar preenchido'}
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
              {result.message}
              {result.details?.length > 0 && (
                <ul>
                  {result.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
