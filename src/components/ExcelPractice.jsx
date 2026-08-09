import BrowserSheet from './BrowserSheet'

export default function ExcelPractice({ progress, markExercise, setSkillExact }) {
  return (
    <BrowserSheet
      progress={progress}
      markExercise={markExercise}
      setSkillExact={setSkillExact}
    />
  )
}
