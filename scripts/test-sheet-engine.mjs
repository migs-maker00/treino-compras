import { evaluateSheet } from '../src/lib/sheetEngine.js'

const data = {
  E2: 0.95,
  F2: 25,
  H2: 1.1,
  I2: 0,
  J2: '=E2+F2',
  K2: '=H2+I2',
  L2: '=MIN(J2:K2)',
  A2: '003',
  A14: '001',
  B14: 'x',
  C14: 'y',
  D14: 0.95,
  A15: '003',
  B15: 'luva',
  C15: 'z',
  D15: 7.2,
  C2: '=PROCV(A2;A14:D15;4;0)',
  B3: 400,
  C3: 30,
  D3: 350,
  E3: 80,
  F3: '=B3+C3',
  G3: '=D3+E3',
  H3: '=SE(F3<G3;"A";"B")',
}

const d = evaluateSheet(data)
console.log({ J2: d.J2, K2: d.K2, L2: d.L2, C2: d.C2, F3: d.F3, G3: d.G3, H3: d.H3 })
const ok =
  d.J2 === 25.95 &&
  d.K2 === 1.1 &&
  d.L2 === 1.1 &&
  Number(d.C2) === 7.2 &&
  d.F3 === 430 &&
  d.G3 === 430 &&
  d.H3 === 'B'
console.log(ok ? 'PASS' : 'FAIL')
if (!ok) process.exit(1)
