import { useState } from 'react'
import BrowserSheet from './BrowserSheet'
import ExcelWebLinks from './ExcelWebLinks'

export default function ExcelPractice({ progress, markExercise, setSkillExact }) {
  const [mode, setMode] = useState('web') // web | site

  return (
    <div>
      <div className="tabs">
        <button
          type="button"
          className={`tab ${mode === 'web' ? 'active' : ''}`}
          onClick={() => setMode('web')}
        >
          Excel na Web
        </button>
        <button
          type="button"
          className={`tab ${mode === 'site' ? 'active' : ''}`}
          onClick={() => setMode('site')}
        >
          Planilha no site
        </button>
      </div>

      {mode === 'web' ? (
        <ExcelWebLinks
          progress={progress}
          markExercise={markExercise}
          setSkillExact={setSkillExact}
        />
      ) : (
        <BrowserSheet
          progress={progress}
          markExercise={markExercise}
          setSkillExact={setSkillExact}
        />
      )}
    </div>
  )
}
