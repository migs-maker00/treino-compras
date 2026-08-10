const PRODUCTS = [
  ['Parafuso inox M8x40', 'Sextavado A2', 100, 'Parafusos BR', 0.95, 25, 'FixNaval', 1.1, 0],
  ['Arruela inox M8', 'Lisa A2', 100, 'Parafusos BR', 0.18, 15, 'MetalMax', 0.15, 20],
  ['Luva nitrílica G', 'Sem pó', 50, 'EPI Total', 8, 30, 'SeguraMais', 7.2, 80],
  ['Óculos proteção', 'Incolor', 10, 'EPI Total', 12.5, 20, 'SeguraMais', 14, 0],
  ['Mangueira 1/2"', 'SAE 100 R1', 20, 'HidroMar', 34, 45, 'TuboSul', 31, 90],
  ['Abraçadeira 1/2"', 'Inox', 20, 'HidroMar', 2.5, 15, 'FixNaval', 2.8, 0],
  ['Disco de corte', '4.1/2" inox', 25, 'Ferramentas Pro', 4.2, 18, 'CorteSul', 3.9, 25],
  ['Cabo 2,5 mm²', 'Flexível 100m', 1, 'EletroMar', 280, 40, 'Fios & Cia', 265, 55],
  ['Disjuntor 20A', 'Bipolar', 5, 'EletroMar', 45, 22, 'Fios & Cia', 48, 0],
  ['Capacete', 'Com jugular', 6, 'EPI Total', 32, 28, 'SeguraMais', 29, 35],
]

const LOOKUP = [
  ['001', 'Parafuso inox M8', 'Parafusos BR', 0.95],
  ['002', 'Arruela inox M8', 'MetalMax', 0.15],
  ['003', 'Luva nitrílica G', 'SeguraMais', 7.2],
  ['004', 'Mangueira 1/2"', 'HidroMar', 34],
  ['005', 'Disco de corte', 'CorteSul', 3.9],
  ['006', 'Cabo 2,5 mm²', 'Fios & Cia', 265],
  ['007', 'Disjuntor 20A', 'EletroMar', 45],
  ['008', 'Capacete', 'EPI Total', 32],
]

async function loadExcelJS() {
  const mod = await import('exceljs')
  return mod.default || mod
}

function styleHeader(row) {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF12233A' },
  }
}

function paintPractice(cell) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFF3BF' },
  }
  cell.border = {
    top: { style: 'thin', color: { argb: 'FFD4A017' } },
    left: { style: 'thin', color: { argb: 'FFD4A017' } },
    bottom: { style: 'thin', color: { argb: 'FFD4A017' } },
    right: { style: 'thin', color: { argb: 'FFD4A017' } },
  }
  // Importante: no Excel, locked=true só trava se a aba estiver protegida.
  // Mesmo assim, destravamos as células de prática explicitamente.
  cell.protection = { locked: false }
}

function unlockWorksheet(ws) {
  ws.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.protection = { locked: false }
    })
  })
  for (let r = 1; r <= 50; r += 1) {
    for (let c = 1; c <= 16; c += 1) {
      ws.getCell(r, c).protection = { locked: false }
    }
  }
}

export function publicPackUrl(filename) {
  return `/exercicios/${filename}`
}

function numClose(a, b, tol = 0.02) {
  const x = Number(String(a).replace(',', '.'))
  const y = Number(b)
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false
  return Math.abs(x - y) <= tol
}

function parseNumberLoose(v) {
  if (v == null || v === '') return null
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const s = String(v).trim().replace(/\s/g, '').replace(',', '.')
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Parse CSV/TSV exported from Excel Web / Sheets (vírgula ou ponto-e-vírgula). */
export function parseCsvText(text) {
  const raw = String(text || '').replace(/^\uFEFF/, '')
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (!lines.length) return []
  const sample = lines[0]
  const semi = (sample.match(/;/g) || []).length
  const comma = (sample.match(/,/g) || []).length
  const delim = semi > comma ? ';' : ','

  function parseLine(line) {
    const out = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"'
          i += 1
        } else {
          inQuotes = !inQuotes
        }
        continue
      }
      if (ch === delim && !inQuotes) {
        out.push(cur.trim())
        cur = ''
        continue
      }
      cur += ch
    }
    out.push(cur.trim())
    return out
  }

  return lines.map(parseLine)
}

function normHeader(h) {
  return String(h || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
}

function colIndex(headerRow, aliases) {
  const norms = headerRow.map(normHeader)
  for (const alias of aliases) {
    const i = norms.indexOf(normHeader(alias))
    if (i >= 0) return i
  }
  return -1
}

function gradeRows(total, ok, details, passMsg, failMsg) {
  const passed = ok === total
  return {
    passed,
    score: Math.round((ok / total) * 100),
    message: passed ? passMsg : failMsg.replace('{ok}', ok).replace('{total}', total),
    details: details.slice(0, 6),
  }
}

function cellNumber(cell) {
  if (!cell || cell.value == null || cell.value === '') return null
  const v = cell.value
  if (typeof v === 'number') return v
  if (typeof v === 'object' && v !== null) {
    if (typeof v.result === 'number') return v.result
    if (typeof v.result === 'string' && v.result.trim() !== '' && !Number.isNaN(Number(v.result))) {
      return Number(v.result)
    }
  }
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v.replace(',', '.')))) {
    return Number(v.replace(',', '.'))
  }
  return null
}

function cellText(cell) {
  if (!cell || cell.value == null) return ''
  const v = cell.value
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number') return String(v)
  if (typeof v === 'object' && v !== null) {
    if (typeof v.result === 'string') return v.result.trim()
    if (typeof v.result === 'number') return String(v.result)
    if (v.richText) return v.richText.map((t) => t.text).join('').trim()
  }
  return String(v).trim()
}

function cellHasFormula(cell) {
  const v = cell?.value
  if (!v) return false
  if (typeof v === 'object' && v.formula) return true
  if (typeof v === 'string' && v.startsWith('=')) return true
  return false
}

export const excelPacks = [
  {
    id: 'cotacao',
    title: 'Exercício 1 — Cotação de fornecedores',
    time: '15–20 min',
    level: 'Essencial',
    summary:
      'Abra no Excel na Web e preencha as células amarelas com fórmulas (Total e Melhor preço).',
    steps: [
      'Abra o exercício no Excel na Web e edite as células amarelas.',
      'Na aba Cotacao: J =E2+F2 | K =H2+I2 | L =MIN(J2:K2) (arraste até a linha 11).',
      'Fique na aba Cotacao → Arquivo → Exportar → Baixar como CSV.',
      'Envie o CSV no site para correção.',
    ],
    filename: 'treino-compras-01-cotacao.xlsx',
    async build(ExcelJS) {
      const wb = new ExcelJS.Workbook()
      wb.creator = 'Treino Compras'

      const info = wb.addWorksheet('Instrucoes')
      info.getColumn(1).width = 90
      ;[
        'TREINO COMPRAS — Exercício 1: Cotação',
        '',
        'Objetivo: praticar fórmulas no Excel na Web.',
        '',
        '1) Vá para a aba Cotacao',
        '2) Nas células AMARELAS, digite fórmulas (não copie números na mão)',
        '3) Coluna J (Total1): =E2+F2  e arraste até a linha 11',
        '4) Coluna K (Total2): =H2+I2  e arraste até a linha 11',
        '5) Coluna L (Melhor): =MÍNIMO(J2:K2)  ou  =MIN(J2:K2)',
        '6) Se abriu só em visualização, use Editar no navegador / Salvar uma cópia',
      ].forEach((line, i) => {
        info.getCell(i + 1, 1).value = line
        if (i === 0) info.getCell(i + 1, 1).font = { bold: true, size: 14 }
      })

      const ws = wb.addWorksheet('Cotacao')
      const headers = [
        'Produto',
        'Especificacao',
        'Qtd',
        'Fornecedor1',
        'Preco1',
        'Frete1',
        'Fornecedor2',
        'Preco2',
        'Frete2',
        'Total1',
        'Total2',
        'Melhor',
      ]
      ws.addRow(headers)
      styleHeader(ws.getRow(1))
      ws.views = [{ state: 'frozen', ySplit: 1 }]
      ws.autoFilter = { from: 'A1', to: 'L1' }

      PRODUCTS.forEach((p) => {
        ws.addRow([...p, null, null, null])
      })

      for (let r = 2; r <= 11; r += 1) {
        ;['J', 'K', 'L'].forEach((col) => paintPractice(ws.getCell(`${col}${r}`)))
      }

      const widths = [24, 16, 8, 16, 10, 10, 14, 10, 10, 10, 10, 10]
      widths.forEach((w, i) => {
        ws.getColumn(i + 1).width = w
      })

      const tip = wb.addWorksheet('Dicas')
      tip.getColumn(1).width = 80
      tip.addRow(['Se travar, use estas fórmulas na linha 2 e arraste:'])
      tip.addRow(['J2', '=E2+F2'])
      tip.addRow(['K2', '=H2+I2'])
      tip.addRow(['L2', '=MIN(J2:K2)   (no Excel PT-BR também pode =MÍNIMO(J2:K2))'])
      tip.addRow([''])
      tip.addRow(['Não abra a aba Gabarito antes de tentar.'])

      const gab = wb.addWorksheet('Gabarito')
      gab.addRow(headers)
      styleHeader(gab.getRow(1))
      PRODUCTS.forEach((p) => {
        const total1 = p[4] + p[5]
        const total2 = p[7] + p[8]
        gab.addRow([...p, total1, total2, Math.min(total1, total2)])
      })
      // Visível, mas no fim — só consulte se travar
      gab.name = 'Gabarito_so_se_travar'

      for (const sheet of wb.worksheets) unlockWorksheet(sheet)
      return wb
    },
    expected() {
      return PRODUCTS.map((p) => {
        const total1 = p[4] + p[5]
        const total2 = p[7] + p[8]
        return { total1, total2, melhor: Math.min(total1, total2) }
      })
    },
    async verify(wb) {
      const ws = wb.getWorksheet('Cotacao') || wb.worksheets.find((s) => /cotac/i.test(s.name))
      if (!ws) {
        return { passed: false, score: 0, message: 'Não achei a aba "Cotacao". Baixe de novo e não renomeie a aba.' }
      }
      const expected = this.expected()
      let ok = 0
      let formulaBonus = 0
      const details = []
      for (let i = 0; i < expected.length; i += 1) {
        const row = i + 2
        const t1 = cellNumber(ws.getCell(row, 10))
        const t2 = cellNumber(ws.getCell(row, 11))
        const mel = cellNumber(ws.getCell(row, 12))
        const rowOk =
          numClose(t1, expected[i].total1) &&
          numClose(t2, expected[i].total2) &&
          numClose(mel, expected[i].melhor)
        const hasF =
          cellHasFormula(ws.getCell(row, 10)) ||
          cellHasFormula(ws.getCell(row, 11)) ||
          cellHasFormula(ws.getCell(row, 12))
        if (rowOk) ok += 1
        if (hasF) formulaBonus += 1
        if (!rowOk) {
          details.push(
            `Linha ${row}: esperado Total1=${expected[i].total1}, Total2=${expected[i].total2}, Melhor=${expected[i].melhor}`,
          )
        }
      }
      const score = Math.round((ok / expected.length) * 85 + (formulaBonus / expected.length) * 15)
      const passed = ok === expected.length
      return {
        passed,
        score,
        message: passed
          ? `Perfeito! ${ok}/${expected.length} linhas corretas${formulaBonus ? ` · fórmulas detectadas em ${formulaBonus} linhas` : ''}.`
          : `${ok}/${expected.length} linhas corretas. Corrija e envie de novo.`,
        details: details.slice(0, 5),
      }
    },
    verifyCsv(rows) {
      if (!rows?.length) {
        return { passed: false, score: 0, message: 'CSV vazio. Exporte de novo a aba Cotacao.' }
      }
      const header = rows[0]
      let i1 = colIndex(header, ['Total1', 'total1'])
      let i2 = colIndex(header, ['Total2', 'total2'])
      let iM = colIndex(header, ['Melhor', 'melhor'])
      // fallback: últimas 3 colunas da tabela de cotação
      if (i1 < 0 || i2 < 0 || iM < 0) {
        if (header.length >= 12) {
          i1 = 9
          i2 = 10
          iM = 11
        } else {
          return {
            passed: false,
            score: 0,
            message: 'Não achei as colunas Total1/Total2/Melhor. Exporte a aba Cotacao como CSV.',
          }
        }
      }
      const expected = this.expected()
      const dataRows = rows.slice(1).filter((r) => r.some((c) => String(c || '').trim() !== ''))
      let ok = 0
      const details = []
      for (let i = 0; i < expected.length; i += 1) {
        const row = dataRows[i]
        if (!row) {
          details.push(`Falta a linha ${i + 2}`)
          continue
        }
        const t1 = parseNumberLoose(row[i1])
        const t2 = parseNumberLoose(row[i2])
        const mel = parseNumberLoose(row[iM])
        const rowOk =
          numClose(t1, expected[i].total1) &&
          numClose(t2, expected[i].total2) &&
          numClose(mel, expected[i].melhor)
        if (rowOk) ok += 1
        else {
          details.push(
            `Linha ${i + 2}: esperado Total1=${expected[i].total1}, Total2=${expected[i].total2}, Melhor=${expected[i].melhor}`,
          )
        }
      }
      return gradeRows(
        expected.length,
        ok,
        details,
        `CSV aprovado! ${ok}/${expected.length} linhas corretas.`,
        `{ok}/{total} linhas corretas no CSV. Corrija e envie de novo.`,
      )
    },
  },
  {
    id: 'procv',
    title: 'Exercício 2 — PROCV / busca de preço',
    time: '15 min',
    level: 'Importante',
    summary: 'No Excel na Web, use PROCV (ou VLOOKUP) para buscar o preço pelo código.',
    steps: [
      'Abra o exercício no Excel na Web e salve uma cópia.',
      'Aba Pedidos: em C2 use =PROCV(A2;Base!A:D;4;FALSO) e arraste.',
      'Fique na aba Pedidos → Arquivo → Exportar → Baixar como CSV.',
      'Envie o CSV no site para correção.',
    ],
    filename: 'treino-compras-02-procv.xlsx',
    async build(ExcelJS) {
      const wb = new ExcelJS.Workbook()
      const info = wb.addWorksheet('Instrucoes')
      info.getColumn(1).width = 90
      ;[
        'TREINO COMPRAS — Exercício 2: PROCV',
        '',
        'Na aba Pedidos, coluna C (Preco), use busca pelo código da coluna A.',
        'Excel PT-BR: =PROCV(A2;Base!A:D;4;FALSO)',
        'Excel EN: =VLOOKUP(A2,Base!A:D,4,FALSE)',
        'Arraste até a última linha.',
        'Se estiver só visualizando: Editar no navegador / Salvar uma cópia.',
      ].forEach((line, i) => {
        info.getCell(i + 1, 1).value = line
      })

      const base = wb.addWorksheet('Base')
      base.addRow(['Codigo', 'Produto', 'Fornecedor', 'Preco'])
      styleHeader(base.getRow(1))
      LOOKUP.forEach((r) => base.addRow(r))
      base.getColumn(1).width = 10
      base.getColumn(2).width = 22
      base.getColumn(3).width = 16
      base.getColumn(4).width = 10

      const pedidos = wb.addWorksheet('Pedidos')
      pedidos.addRow(['Codigo', 'Produto', 'Preco'])
      styleHeader(pedidos.getRow(1))
      const order = [
        ['003', 'Luva nitrílica G'],
        ['001', 'Parafuso inox M8'],
        ['005', 'Disco de corte'],
        ['002', 'Arruela inox M8'],
        ['007', 'Disjuntor 20A'],
        ['004', 'Mangueira 1/2"'],
        ['008', 'Capacete'],
        ['006', 'Cabo 2,5 mm²'],
      ]
      order.forEach((r) => pedidos.addRow([...r, null]))
      for (let r = 2; r <= 9; r += 1) paintPractice(pedidos.getCell(`C${r}`))
      pedidos.getColumn(1).width = 10
      pedidos.getColumn(2).width = 22
      pedidos.getColumn(3).width = 12

      const gab = wb.addWorksheet('Gabarito_so_se_travar')
      gab.addRow(['Codigo', 'Preco'])
      order.forEach(([code]) => {
        const row = LOOKUP.find((l) => l[0] === code)
        gab.addRow([code, row[3]])
      })

      for (const sheet of wb.worksheets) unlockWorksheet(sheet)
      return wb
    },
    async verify(wb) {
      const ws = wb.getWorksheet('Pedidos')
      if (!ws) {
        return { passed: false, score: 0, message: 'Não achei a aba "Pedidos".' }
      }
      const order = ['003', '001', '005', '002', '007', '004', '008', '006']
      let ok = 0
      let formulas = 0
      const details = []
      order.forEach((code, i) => {
        const row = i + 2
        const expected = LOOKUP.find((l) => l[0] === code)[3]
        const got = cellNumber(ws.getCell(row, 3))
        const good = numClose(got, expected)
        if (good) ok += 1
        if (cellHasFormula(ws.getCell(row, 3))) formulas += 1
        if (!good) details.push(`Linha ${row} (código ${code}): esperado ${expected}`)
      })
      const passed = ok === order.length
      const score = Math.round((ok / order.length) * 80 + (formulas / order.length) * 20)
      return {
        passed,
        score,
        message: passed
          ? `PROCV ok! ${ok}/${order.length} preços corretos.`
          : `${ok}/${order.length} corretos. Confira a fórmula PROCV/VLOOKUP.`,
        details: details.slice(0, 5),
      }
    },
    verifyCsv(rows) {
      if (!rows?.length) {
        return { passed: false, score: 0, message: 'CSV vazio. Exporte a aba Pedidos.' }
      }
      const header = rows[0]
      let iPreco = colIndex(header, ['Preco', 'Preço', 'preco'])
      if (iPreco < 0) {
        iPreco = header.length >= 3 ? 2 : -1
      }
      if (iPreco < 0) {
        return {
          passed: false,
          score: 0,
          message: 'Não achei a coluna Preco. Exporte a aba Pedidos como CSV.',
        }
      }
      const order = ['003', '001', '005', '002', '007', '004', '008', '006']
      const dataRows = rows.slice(1).filter((r) => r.some((c) => String(c || '').trim() !== ''))
      let ok = 0
      const details = []
      order.forEach((code, i) => {
        const expected = LOOKUP.find((l) => l[0] === code)[3]
        const row = dataRows[i]
        if (!row) {
          details.push(`Falta a linha do código ${code}`)
          return
        }
        const got = parseNumberLoose(row[iPreco])
        if (numClose(got, expected)) ok += 1
        else details.push(`Linha ${i + 2} (código ${code}): esperado ${expected}`)
      })
      return gradeRows(
        order.length,
        ok,
        details,
        `CSV aprovado! PROCV ok — ${ok}/${order.length} preços corretos.`,
        `{ok}/{total} corretos no CSV. Confira PROCV e exporte de novo a aba Pedidos.`,
      )
    },
  },
  {
    id: 'decisao',
    title: 'Exercício 3 — Decisão de compra',
    time: '10–15 min',
    level: 'Avançado',
    summary: 'No Excel na Web, calcule totais e escolha o melhor fornecedor com SE.',
    steps: [
      'Abra no Excel na Web, salve uma cópia e preencha F, G e H.',
      'H2: =SE(F2<G2;"A";"B")',
      'Fique na aba Decisao → Arquivo → Exportar → Baixar como CSV.',
      'Envie o CSV no site para correção.',
    ],
    filename: 'treino-compras-03-decisao.xlsx',
    async build(ExcelJS) {
      const wb = new ExcelJS.Workbook()
      const info = wb.addWorksheet('Instrucoes')
      info.getColumn(1).width = 90
      ;[
        'TREINO COMPRAS — Exercício 3: Decisão',
        'Preencha F (TotalA), G (TotalB) e H (Vencedor: A ou B).',
        'H2 exemplo PT: =SE(F2<G2;"A";"B")',
        'H2 exemplo EN: =IF(F2<G2,"A","B")',
        'Se estiver só visualizando: Editar no navegador / Salvar uma cópia.',
      ].forEach((line, i) => {
        info.getCell(i + 1, 1).value = line
      })

      const rows = [
        ['Luva nitrílica G', 400, 30, 350, 80],
        ['Parafuso inox kit', 95, 25, 110, 0],
        ['Mangueira 1/2"', 680, 45, 620, 90],
        ['Cabo 2,5 mm²', 280, 40, 265, 55],
        ['Capacete', 32, 28, 29, 35],
        ['Disco de corte', 105, 18, 97.5, 25],
      ]

      const ws = wb.addWorksheet('Decisao')
      ws.addRow(['Produto', 'PrecoA', 'FreteA', 'PrecoB', 'FreteB', 'TotalA', 'TotalB', 'Vencedor'])
      styleHeader(ws.getRow(1))
      rows.forEach((r) => ws.addRow([...r, null, null, null]))
      for (let r = 2; r <= 7; r += 1) {
        ;['F', 'G', 'H'].forEach((col) => paintPractice(ws.getCell(`${col}${r}`)))
      }
      ;[22, 10, 10, 10, 10, 10, 10, 12].forEach((w, i) => {
        ws.getColumn(i + 1).width = w
      })

      const gab = wb.addWorksheet('Gabarito_so_se_travar')
      gab.addRow(['Produto', 'TotalA', 'TotalB', 'Vencedor'])
      rows.forEach((r) => {
        const ta = r[1] + r[2]
        const tb = r[3] + r[4]
        gab.addRow([r[0], ta, tb, ta < tb ? 'A' : 'B'])
      })
      for (const sheet of wb.worksheets) unlockWorksheet(sheet)
      return wb
    },
    async verify(wb) {
      const ws = wb.getWorksheet('Decisao')
      if (!ws) return { passed: false, score: 0, message: 'Não achei a aba "Decisao".' }
      const expected = [
        { ta: 430, tb: 430, win: 'B' },
        { ta: 120, tb: 110, win: 'B' },
        { ta: 725, tb: 710, win: 'B' },
        { ta: 320, tb: 320, win: 'B' },
        { ta: 60, tb: 64, win: 'A' },
        { ta: 123, tb: 122.5, win: 'B' },
      ]

      let ok = 0
      const details = []
      expected.forEach((exp, i) => {
        const row = i + 2
        const ta = cellNumber(ws.getCell(row, 6))
        const tb = cellNumber(ws.getCell(row, 7))
        const win = cellText(ws.getCell(row, 8)).toUpperCase()
        const good = numClose(ta, exp.ta) && numClose(tb, exp.tb) && win === exp.win
        if (good) ok += 1
        else details.push(`Linha ${row}: TotalA=${exp.ta}, TotalB=${exp.tb}, Vencedor=${exp.win}`)
      })
      const passed = ok === expected.length
      return {
        passed,
        score: Math.round((ok / expected.length) * 100),
        message: passed
          ? 'Decisão correta em todas as linhas!'
          : `${ok}/${expected.length} linhas ok. Em empate, SE(F<G;"A";"B") escolhe B.`,
        details: details.slice(0, 5),
      }
    },
    verifyCsv(rows) {
      if (!rows?.length) {
        return { passed: false, score: 0, message: 'CSV vazio. Exporte a aba Decisao.' }
      }
      const header = rows[0]
      let iTa = colIndex(header, ['TotalA', 'totala'])
      let iTb = colIndex(header, ['TotalB', 'totalb'])
      let iWin = colIndex(header, ['Vencedor', 'vencedor'])
      if (iTa < 0 || iTb < 0 || iWin < 0) {
        if (header.length >= 8) {
          iTa = 5
          iTb = 6
          iWin = 7
        } else {
          return {
            passed: false,
            score: 0,
            message: 'Não achei TotalA/TotalB/Vencedor. Exporte a aba Decisao como CSV.',
          }
        }
      }
      const expected = [
        { ta: 430, tb: 430, win: 'B' },
        { ta: 120, tb: 110, win: 'B' },
        { ta: 725, tb: 710, win: 'B' },
        { ta: 320, tb: 320, win: 'B' },
        { ta: 60, tb: 64, win: 'A' },
        { ta: 123, tb: 122.5, win: 'B' },
      ]
      const dataRows = rows.slice(1).filter((r) => r.some((c) => String(c || '').trim() !== ''))
      let ok = 0
      const details = []
      expected.forEach((exp, i) => {
        const row = dataRows[i]
        if (!row) {
          details.push(`Falta a linha ${i + 2}`)
          return
        }
        const ta = parseNumberLoose(row[iTa])
        const tb = parseNumberLoose(row[iTb])
        const win = String(row[iWin] || '')
          .trim()
          .toUpperCase()
        const good = numClose(ta, exp.ta) && numClose(tb, exp.tb) && win === exp.win
        if (good) ok += 1
        else details.push(`Linha ${i + 2}: TotalA=${exp.ta}, TotalB=${exp.tb}, Vencedor=${exp.win}`)
      })
      return gradeRows(
        expected.length,
        ok,
        details,
        'CSV aprovado! Decisão correta em todas as linhas.',
        `{ok}/{total} linhas ok no CSV. Em empate, SE(F<G;"A";"B") escolhe B.`,
      )
    },
  },
]

export async function verifyUploadedFile(pack, file) {
  const name = (file?.name || '').toLowerCase()
  const isCsv = name.endsWith('.csv') || file?.type === 'text/csv' || file?.type === 'text/plain'
  const isOds = name.endsWith('.ods')

  if (isOds) {
    return {
      passed: false,
      score: 0,
      message:
        'ODS ainda não é aceito na correção. Use Arquivo → Exportar → Baixar como CSV (ou CSV UTF-8) e envie o CSV.',
    }
  }

  if (isCsv) {
    if (typeof pack.verifyCsv !== 'function') {
      return { passed: false, score: 0, message: 'Este exercício ainda não aceita CSV.' }
    }
    const text = await file.text()
    const rows = parseCsvText(text)
    return pack.verifyCsv(rows)
  }

  // .xlsx e similares
  try {
    const ExcelJS = await loadExcelJS()
    const wb = new ExcelJS.Workbook()
    const data = await file.arrayBuffer()
    await wb.xlsx.load(data)
    return pack.verify(wb)
  } catch (err) {
    return {
      passed: false,
      score: 0,
      message: `Não consegui ler este arquivo. Exporte como CSV (Arquivo → Exportar → Baixar como CSV) e envie de novo. (${err.message})`,
    }
  }
}
