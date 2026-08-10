import { evaluateSheet } from '../src/lib/sheetEngine.js'
import { browserSheets } from '../src/data/browserSheets.js'
import { indexToCol } from '../src/lib/sheetEngine.js'

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
}

// 1) Fórmulas básicas
{
  const data = {
    C2: 100,
    E2: 0.95,
    F2: 25,
    H2: 1.1,
    I2: 0,
    J2: '=C2*E2+F2',
    K2: '=C2*H2+I2',
    L2: '=MIN(J2:K2)',
    L3: '=MÍNIMO(J2:K2)',
    A10: '003',
    A14: '001',
    B14: 'x',
    C14: 'y',
    D14: 0.95,
    A15: '003',
    B15: 'luva',
    C15: 'z',
    D15: 7.2,
    C10: '=PROCV(A10;A14:D15;4;0)',
    C11: '=VLOOKUP(A10;A14:D15;4;FALSE)',
    B4: 400,
    C4: 30,
    D4: 350,
    E4: 80,
    F4: '=B4+C4',
    G4: '=D4+E4',
    H4: '=SE(F4<G4;"A";"B")',
    H5: '=IF(F4<=G4;"X";"Y")',
  }
  const d = evaluateSheet(data)
  assert(d.J2 === 120, `J2 total ${d.J2}`)
  assert(Math.abs(d.K2 - 110) < 0.02, `K2 total ${d.K2}`)
  assert(Math.abs(d.L2 - 110) < 0.02, `L2 MIN ${d.L2}`)
  assert(Math.abs(d.L3 - 110) < 0.02, `L3 MÍNIMO ${d.L3}`)
  assert(Number(d.C10) === 7.2, `C10 PROCV ${d.C10}`)
  assert(Number(d.C11) === 7.2, `C11 VLOOKUP ${d.C11}`)
  assert(d.F4 === 430 && d.G4 === 430, `totais ${d.F4}/${d.G4}`)
  assert(d.H4 === 'B', `SE empate escolhe B, veio ${d.H4}`)
  assert(d.H5 === 'X', `IF <= ${d.H5}`)
  console.log('OK motor de fórmulas')
}

// 2) Exercício cotação completo
{
  const sheet = browserSheets.find((s) => s.id === 'cotacao')
  const data = {}
  sheet.headers.forEach((h, c) => {
    data[`${indexToCol(c)}1`] = h
  })
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${r}`] = val
    })
    data[`J${r}`] = `=C${r}*E${r}+F${r}`
    data[`K${r}`] = `=C${r}*H${r}+I${r}`
    data[`L${r}`] = `=MIN(J${r}:K${r})`
  })
  const d = evaluateSheet(data)
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    const [t1, t2, mel] = sheet.expected(row)
    assert(Math.abs(d[`J${r}`] - t1) < 0.02, `cotacao J${r}`)
    assert(Math.abs(d[`K${r}`] - t2) < 0.02, `cotacao K${r}`)
    assert(Math.abs(d[`L${r}`] - mel) < 0.02, `cotacao L${r}`)
  })
  console.log('OK exercício cotação')
}

// 3) Exercício PROCV completo
{
  const sheet = browserSheets.find((s) => s.id === 'procv')
  const data = {}
  sheet.headers.forEach((h, c) => {
    data[`${indexToCol(c)}1`] = h
  })
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${r}`] = val
    })
    data[`C${r}`] = `=PROCV(A${r};A14:D21;4;0)`
  })
  const start = sheet.lookupStartRow
  sheet.lookupHeaders.forEach((h, c) => {
    data[`${indexToCol(c)}${start - 1}`] = h
  })
  sheet.lookupRows.forEach((row, i) => {
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${start + i}`] = val
    })
  })
  const d = evaluateSheet(data)
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    const [exp] = sheet.expected(row, sheet)
    assert(Number(d[`C${r}`]) === exp, `procv C${r} esperado ${exp} veio ${d[`C${r}`]}`)
  })
  console.log('OK exercício PROCV')
}

// 4) Exercício decisão completo
{
  const sheet = browserSheets.find((s) => s.id === 'decisao')
  const data = {}
  sheet.headers.forEach((h, c) => {
    data[`${indexToCol(c)}1`] = h
  })
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${r}`] = val
    })
    data[`F${r}`] = `=B${r}+C${r}`
    data[`G${r}`] = `=D${r}+E${r}`
    data[`H${r}`] = `=SE(F${r}<G${r};"A";"B")`
  })
  const d = evaluateSheet(data)
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    const [ta, tb, win] = sheet.expected(row)
    assert(Math.abs(d[`F${r}`] - ta) < 0.02, `dec F${r}`)
    assert(Math.abs(d[`G${r}`] - tb) < 0.02, `dec G${r}`)
    assert(String(d[`H${r}`]) === win, `dec H${r} esperado ${win} veio ${d[`H${r}`]}`)
  })
  console.log('OK exercício decisão')
}

console.log('PASS all sheet tests')
