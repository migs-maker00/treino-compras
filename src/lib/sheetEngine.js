/** Mini motor de fórmulas para treino no navegador (sem Excel). */

export function colToIndex(col) {
  let n = 0
  const s = col.toUpperCase()
  for (let i = 0; i < s.length; i += 1) n = n * 26 + (s.charCodeAt(i) - 64)
  return n - 1
}

export function indexToCol(index) {
  let n = index + 1
  let s = ''
  while (n > 0) {
    const r = (n - 1) % 26
    s = String.fromCharCode(65 + r) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

function normalizeFormula(input) {
  return String(input || '')
    .trim()
    .replace(/^\uFEFF/, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,/g, ';')
    .replace(/\s+/g, '')
}

function stripAccents(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseNumber(v) {
  if (v == null || v === '') return null
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'boolean') return v ? 1 : 0
  const s = String(v).trim().replace(',', '.')
  if (s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function splitArgs(inner) {
  const args = []
  let cur = ''
  let depth = 0
  let inStr = null
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i]
    if (inStr) {
      cur += ch
      if (ch === inStr) inStr = null
      continue
    }
    if (ch === '"' || ch === "'") {
      inStr = ch
      cur += ch
      continue
    }
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (ch === ';' && depth === 0) {
      args.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur !== '') args.push(cur)
  return args
}

function resolveRef(ref, getValue, stack) {
  const m = /^([A-Z]+)(\d+)$/i.exec(ref)
  if (!m) throw new Error(`Ref inválida: ${ref}`)
  const addr = `${m[1].toUpperCase()}${m[2]}`
  if (stack.has(addr)) throw new Error('Referência circular')
  stack.add(addr)
  const val = getValue(addr, stack)
  stack.delete(addr)
  return val
}

function resolveRange(a, b, getValue, stack) {
  const ma = /^([A-Z]+)(\d+)$/i.exec(a)
  const mb = /^([A-Z]+)(\d+)$/i.exec(b)
  if (!ma || !mb) throw new Error('Intervalo inválido')
  const c1 = colToIndex(ma[1])
  const c2 = colToIndex(mb[1])
  const r1 = Number(ma[2])
  const r2 = Number(mb[2])
  const out = []
  for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r += 1) {
    for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c += 1) {
      out.push(resolveRef(`${indexToCol(c)}${r}`, getValue, stack))
    }
  }
  return out
}

function evalCondition(raw, getValue, stack) {
  const e = stripAccents(normalizeFormula(raw))
  // CONT.SE(...)>1 etc.: resolve função à esquerda antes de comparar
  const fnCmp = /^(CONT\.SE|COUNTIF)\((.+)\)(<=|>=|<>|=|<|>)(.+)$/i.exec(e)
  if (fnCmp) {
    const left = evalContSe(fnCmp[2], getValue, stack)
    const op = fnCmp[3]
    const right = evalExpr(fnCmp[4], getValue, stack)
    return compareValues(left, op, right)
  }
  const m = /^(.+?)(<=|>=|<>|=|<|>)(.+)$/.exec(e)
  if (!m) return Boolean(evalExpr(e, getValue, stack))
  const left = evalExpr(m[1], getValue, stack)
  const op = m[2]
  const right = evalExpr(m[3], getValue, stack)
  return compareValues(left, op, right)
}

function compareValues(left, op, right) {
  const ln = parseNumber(left)
  const rn = parseNumber(right)
  const L = ln != null ? ln : left
  const R = rn != null ? rn : right
  switch (op) {
    case '=':
      return String(L) === String(R) || L == R // eslint-disable-line eqeqeq
    case '<>':
      return String(L) !== String(R) && L != R // eslint-disable-line eqeqeq
    case '<':
      return L < R
    case '>':
      return L > R
    case '<=':
      return L <= R
    case '>=':
      return L >= R
    default:
      return false
  }
}

function evalMinMax(fn, argsRaw, getValue, stack) {
  const parts = splitArgs(argsRaw)
  let nums = []
  for (const p of parts) {
    if (p.includes(':')) {
      const [a, b] = p.split(':')
      nums = nums.concat(resolveRange(a, b, getValue, stack).map(parseNumber).filter((n) => n != null))
    } else {
      const v = /^[A-Z]+\d+$/i.test(p)
        ? parseNumber(resolveRef(p, getValue, stack))
        : parseNumber(evalExpr(p, getValue, stack))
      if (v != null) nums.push(v)
    }
  }
  if (!nums.length) return 0
  const name = fn.toUpperCase()
  return name.startsWith('MIN') ? Math.min(...nums) : Math.max(...nums)
}

function evalProcv(argsRaw, getValue, stack) {
  const args = splitArgs(argsRaw)
  if (args.length < 3) throw new Error('PROCV precisa de busca;intervalo;coluna')
  const key = String(evalExpr(args[0], getValue, stack)).trim()
  const range = args[1]
  if (!range.includes(':')) throw new Error('Intervalo do PROCV inválido')
  const [a, b] = range.split(':')
  const ma = /^([A-Z]+)(\d+)$/i.exec(a)
  const mb = /^([A-Z]+)(\d+)$/i.exec(b)
  if (!ma || !mb) throw new Error('Intervalo do PROCV inválido')
  const c1 = colToIndex(ma[1])
  const c2 = colToIndex(mb[1])
  const r1 = Number(ma[2])
  const r2 = Number(mb[2])
  const colOffset = Number(evalExpr(args[2], getValue, stack)) - 1
  for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r += 1) {
    const first = resolveRef(`${indexToCol(Math.min(c1, c2))}${r}`, getValue, stack)
    if (String(first).trim() === key) {
      const col = Math.min(c1, c2) + colOffset
      return resolveRef(`${indexToCol(col)}${r}`, getValue, stack)
    }
  }
  return '#N/D'
}

function evalContSe(argsRaw, getValue, stack) {
  const args = splitArgs(argsRaw)
  if (args.length < 2) throw new Error('CONT.SE precisa de intervalo;critério')
  const range = args[0]
  if (!range.includes(':')) throw new Error('Intervalo do CONT.SE inválido')
  const [a, b] = range.split(':')
  const values = resolveRange(a, b, getValue, stack)
  const criteria = evalExpr(args[1], getValue, stack)
  const critNum = parseNumber(criteria)
  let count = 0
  for (const v of values) {
    if (critNum != null) {
      const n = parseNumber(v)
      if (n != null && Math.abs(n - critNum) <= 0.02) count += 1
    } else if (String(v).trim().toLowerCase() === String(criteria).trim().toLowerCase()) {
      count += 1
    }
  }
  return count
}

function evalSe(argsRaw, getValue, stack) {
  const args = splitArgs(argsRaw)
  if (args.length < 3) throw new Error('SE precisa de 3 argumentos')
  const cond = evalCondition(args[0], getValue, stack)
  return evalExpr(cond ? args[1] : args[2], getValue, stack)
}

function evalExpr(expr, getValue, stack) {
  let e = stripAccents(normalizeFormula(expr))
  if (e.startsWith('=')) e = e.slice(1)
  if (!e) return ''

  if ((e.startsWith('"') && e.endsWith('"')) || (e.startsWith("'") && e.endsWith("'"))) {
    return e.slice(1, -1)
  }

  const asNum = parseNumber(e)
  if (asNum != null && /^[+-]?\d+([.,]\d+)?$/.test(e)) return asNum

  let m = /^(MIN|MINIMO|MAX|MAXIMO)\((.+)\)$/i.exec(e)
  if (m) return evalMinMax(m[1], m[2], getValue, stack)

  m = /^(PROCV|VLOOKUP)\((.+)\)$/i.exec(e)
  if (m) return evalProcv(m[2], getValue, stack)

  m = /^(CONT\.SE|COUNTIF)\((.+)\)$/i.exec(e)
  if (m) return evalContSe(m[2], getValue, stack)

  m = /^(SE|IF)\((.+)\)$/i.exec(e)
  if (m) return evalSe(m[2], getValue, stack)

  // referência pura de célula (preserva texto como "003")
  m = /^([A-Z]+\d+)$/i.exec(e)
  if (m) return resolveRef(m[1], getValue, stack)

  // arithmetic / comparisons with cell refs
  if (/[A-Z]+\d+/i.test(e) || /[+\-*/()]/.test(e)) {
    const replaced = e.replace(/[A-Z]+\d+/gi, (ref) => {
      const v = resolveRef(ref, getValue, stack)
      const n = parseNumber(v)
      if (n != null) return `(${n})`
      return `(0)`
    })
    if (!/^[\d.+\-*/() ]+$/.test(replaced)) {
      throw new Error(`Expressão não suportada: ${expr}`)
    }
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${replaced});`)()
  }

  // plain text result (A, B, etc.)
  return e
}

export function evaluateCell(address, data, cache = {}, stack = new Set()) {
  if (Object.prototype.hasOwnProperty.call(cache, address)) return cache[address]
  const raw = data[address]
  if (raw == null || raw === '') {
    cache[address] = ''
    return ''
  }
  const text = String(raw)
  if (!text.trim().startsWith('=')) {
    cache[address] = text
    return text
  }

  const getValue = (addr, st) => evaluateCell(addr, data, cache, st)
  try {
    const value = evalExpr(text, getValue, stack)
    cache[address] = value
    return value
  } catch {
    cache[address] = '#ERRO'
    return '#ERRO'
  }
}

export function evaluateSheet(data) {
  const cache = {}
  const display = {}
  for (const addr of Object.keys(data)) {
    display[addr] = evaluateCell(addr, data, cache)
  }
  return display
}

export function numClose(a, b, tol = 0.02) {
  const x = parseNumber(a)
  const y = parseNumber(b)
  if (x == null || y == null) return false
  return Math.abs(x - y) <= tol
}
