import { evaluateSheet } from '../src/lib/sheetEngine.js'
import { browserSheets } from '../src/data/browserSheets.js'
import { indexToCol } from '../src/lib/sheetEngine.js'

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
}

// 1) Fórmulas básicas + Empate + CONT.SE
{
  const data = {
    C2: 100,
    E2: 0.95,
    F2: 25,
    H2: 1.1,
    I2: 0,
    D2: 'Parafusos BR',
    G2: 'FixNaval',
    J2: '=C2*E2+F2',
    K2: '=C2*H2+I2',
    L2: '=SE(J2=K2;"Empate";SE(J2<K2;D2;G2))',
    B4: 400,
    C4: 30,
    D4: 350,
    E4: 80,
    F4: '=B4+C4',
    G4: '=D4+E4',
    H4: '=SE(F4=G4;"Empate";SE(F4<G4;"A";"B"))',
    B5: 0.15,
    C5: 0.15,
    D5: 0.2,
    E5: '=MIN(B5:D5)',
    F5: '=SE(CONT.SE(B5:D5;E5)>1;"Empate";SE(B5=E5;"A";SE(C5=E5;"B";"C")))',
  }
  const d = evaluateSheet(data)
  assert(d.J2 === 120, `J2 total ${d.J2}`)
  assert(Math.abs(d.K2 - 110) < 0.02, `K2 total ${d.K2}`)
  assert(d.L2 === 'FixNaval', `L2 melhor ${d.L2}`)
  assert(d.F4 === 430 && d.G4 === 430, `totais ${d.F4}/${d.G4}`)
  assert(d.H4 === 'Empate', `SE empate veio ${d.H4}`)
  assert(Math.abs(d.E5 - 0.15) < 0.02, `MIN ${d.E5}`)
  assert(d.F5 === 'Empate', `CONT.SE empate veio ${d.F5}`)
  console.log('OK motor de fórmulas')
}

function fillAndCheck(sheetId, fillFn) {
  const sheet = browserSheets.find((s) => s.id === sheetId)
  const data = {}
  sheet.headers.forEach((h, c) => {
    data[`${indexToCol(c)}1`] = h
  })
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    row.forEach((val, c) => {
      data[`${indexToCol(c)}${r}`] = val
    })
    fillFn(data, r, sheet)
  })
  if (sheet.lookupRows) {
    const start = sheet.lookupStartRow
    sheet.lookupHeaders.forEach((h, c) => {
      data[`${indexToCol(c)}${start - 1}`] = h
    })
    sheet.lookupRows.forEach((row, i) => {
      row.forEach((val, c) => {
        data[`${indexToCol(c)}${start + i}`] = val
      })
    })
  }
  const d = evaluateSheet(data)
  sheet.rows.forEach((row, i) => {
    const r = i + 2
    const expected = sheet.expected(row, sheet)
    expected.forEach((exp, idx) => {
      const col = sheet.editableCols[idx]
      const addr = `${indexToCol(col)}${r}`
      const got = d[addr]
      const good =
        typeof exp === 'string'
          ? String(got).trim().toUpperCase() === String(exp).trim().toUpperCase()
          : Math.abs(Number(got) - Number(exp)) < 0.02
      assert(good, `${sheetId} ${addr}: esperado ${exp}, veio ${got}`)
    })
  })
  console.log(`OK exercício ${sheetId}`)
}

fillAndCheck('cotacao', (data, r) => {
  data[`J${r}`] = `=C${r}*E${r}+F${r}`
  data[`K${r}`] = `=C${r}*H${r}+I${r}`
  data[`L${r}`] = `=SE(J${r}=K${r};"Empate";SE(J${r}<K${r};D${r};G${r}))`
})

fillAndCheck('procv', (data, r) => {
  data[`C${r}`] = `=PROCV(A${r};A14:D21;4;0)`
})

fillAndCheck('decisao', (data, r) => {
  data[`F${r}`] = `=B${r}+C${r}`
  data[`G${r}`] = `=D${r}+E${r}`
  data[`H${r}`] = `=SE(F${r}=G${r};"Empate";SE(F${r}<G${r};"A";"B"))`
})

fillAndCheck('desempate', (data, r) => {
  data[`F${r}`] =
    `=SE(B${r}<C${r};"A";SE(B${r}>C${r};"B";SE(D${r}<E${r};"A";SE(D${r}>E${r};"B";"Empate"))))`
})

fillAndCheck('tres-fornecedores', (data, r) => {
  data[`E${r}`] = `=MIN(B${r}:D${r})`
  data[`F${r}`] =
    `=SE(CONT.SE(B${r}:D${r};E${r})>1;"Empate";SE(B${r}=E${r};"A";SE(C${r}=E${r};"B";"C")))`
})

console.log('PASS all sheet tests')
