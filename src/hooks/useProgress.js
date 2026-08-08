import { useEffect, useMemo, useState } from 'react'

const KEY = 'treino-compras-progress-v1'

const defaultState = {
  completedDays: [],
  completedModules: [],
  quizScores: {},
  cotacaoDone: false,
  simDone: {},
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return defaultState
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  const percent = useMemo(() => {
    const dayPts = progress.completedDays.length
    const modPts = progress.completedModules.length
    const quizPts = Object.keys(progress.quizScores).length
    const extra = (progress.cotacaoDone ? 1 : 0) + Object.keys(progress.simDone).length
    const total = 7 + 6 + 2 + 1 + 3
    const done = dayPts + modPts + quizPts + extra
    return Math.min(100, Math.round((done / total) * 100))
  }, [progress])

  function toggleDay(day) {
    setProgress((p) => {
      const has = p.completedDays.includes(day)
      return {
        ...p,
        completedDays: has
          ? p.completedDays.filter((d) => d !== day)
          : [...p.completedDays, day],
      }
    })
  }

  function markModule(id) {
    setProgress((p) => ({
      ...p,
      completedModules: p.completedModules.includes(id)
        ? p.completedModules
        : [...p.completedModules, id],
    }))
  }

  function setQuizScore(id, score) {
    setProgress((p) => ({
      ...p,
      quizScores: { ...p.quizScores, [id]: score },
    }))
  }

  function markCotacao() {
    setProgress((p) => ({ ...p, cotacaoDone: true }))
  }

  function markSim(id) {
    setProgress((p) => ({
      ...p,
      simDone: { ...p.simDone, [id]: true },
    }))
  }

  function reset() {
    setProgress(defaultState)
  }

  return {
    progress,
    percent,
    toggleDay,
    markModule,
    setQuizScore,
    markCotacao,
    markSim,
    reset,
  }
}
