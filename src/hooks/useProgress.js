import { useEffect, useMemo, useState } from 'react'

const KEY = 'treino-compras-progress-v2'

export const SKILLS = [
  'pesquisa',
  'email',
  'recebimento',
  'excel',
  'materiais',
  'mentalidade',
  'simulacao',
]

const defaultState = {
  completedDays: [],
  skillScores: {
    excel: 0,
    pesquisa: 0,
    email: 0,
    recebimento: 0,
    materiais: 0,
    mentalidade: 0,
    simulacao: 0,
  },
  exerciseDone: {},
  pesquisaNotes: {},
  pesquisaPicked: [],
}

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function normalize(raw) {
  const base = structuredClone(defaultState)
  if (!raw || typeof raw !== 'object') return base

  if (Array.isArray(raw.completedDays)) {
    base.completedDays = raw.completedDays.filter((d) => Number.isInteger(d))
  }

  if (raw.skillScores && typeof raw.skillScores === 'object') {
    for (const k of SKILLS) {
      const v = Number(raw.skillScores[k])
      if (Number.isFinite(v)) base.skillScores[k] = clamp(v)
    }
  }

  // migrate v1 loosely
  if (Array.isArray(raw.completedModules)) {
    for (const id of raw.completedModules) {
      if (base.skillScores[id] !== undefined && base.skillScores[id] < 70) {
        base.skillScores[id] = 70
      }
    }
  }

  if (raw.exerciseDone && typeof raw.exerciseDone === 'object') {
    base.exerciseDone = { ...raw.exerciseDone }
  }
  if (raw.pesquisaNotes && typeof raw.pesquisaNotes === 'object') {
    base.pesquisaNotes = { ...raw.pesquisaNotes }
  }
  if (Array.isArray(raw.pesquisaPicked)) {
    base.pesquisaPicked = raw.pesquisaPicked
  }

  return base
}

function load() {
  try {
    const v2 = localStorage.getItem(KEY)
    if (v2) return normalize(JSON.parse(v2))
    const v1 = localStorage.getItem('treino-compras-progress-v1')
    if (v1) return normalize(JSON.parse(v1))
    return structuredClone(defaultState)
  } catch {
    return structuredClone(defaultState)
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  const skillScores = progress.skillScores

  const percent = useMemo(() => {
    const vals = SKILLS.map((k) => skillScores[k] || 0)
    return clamp(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [skillScores])

  const readiness = useMemo(() => {
    if (percent >= 80) return { label: 'Pronto para o básico', tone: 'ok' }
    if (percent >= 55) return { label: 'Quase pronto — continue praticando', tone: 'warn' }
    return { label: 'Em treinamento', tone: 'bad' }
  }, [percent])

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

  function setSkillScore(skill, score) {
    setProgress((p) => ({
      ...p,
      skillScores: {
        ...p.skillScores,
        [skill]: Math.max(p.skillScores[skill] || 0, clamp(score)),
      },
    }))
  }

  function markExercise(id, passed, skill, scoreBoost = 15) {
    setProgress((p) => {
      const next = {
        ...p,
        exerciseDone: { ...p.exerciseDone, [id]: !!passed },
      }
      if (passed && skill) {
        next.skillScores = {
          ...p.skillScores,
          [skill]: Math.max(p.skillScores[skill] || 0, clamp((p.skillScores[skill] || 0) + scoreBoost)),
        }
      }
      return next
    })
  }

  function setSkillExact(skill, score) {
    setProgress((p) => ({
      ...p,
      skillScores: {
        ...p.skillScores,
        [skill]: clamp(score),
      },
    }))
  }

  function savePesquisa(picked, notes) {
    setProgress((p) => ({
      ...p,
      pesquisaPicked: picked,
      pesquisaNotes: notes,
    }))
  }

  function isModuleDone(id) {
    return (skillScores[id] || 0) >= 70
  }

  function reset() {
    setProgress(structuredClone(defaultState))
  }

  return {
    progress,
    percent,
    readiness,
    skillScores,
    toggleDay,
    setSkillScore,
    setSkillExact,
    markExercise,
    savePesquisa,
    isModuleDone,
    reset,
  }
}
