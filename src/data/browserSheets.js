/** Exercícios de planilha no navegador (não precisa de Excel/chave). */

function pickAB(ta, tb) {
  if (Math.abs(ta - tb) < 0.02) return 'Empate'
  return ta < tb ? 'A' : 'B'
}

export const browserSheets = [
  {
    id: 'cotacao',
    title: 'Cotação (no navegador)',
    help: 'Totais com Qtd×Preço+Frete. Em Melhor: fornecedor mais barato ou Empate.',
    headers: ['Produto', 'Spec', 'Qtd', 'Forn1', 'Preco1', 'Frete1', 'Forn2', 'Preco2', 'Frete2', 'Total1', 'Total2', 'Melhor'],
    rows: [
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
    ],
    editableCols: [9, 10, 11],
    hints: [
      'J2: =C2*E2+F2',
      'K2: =C2*H2+I2',
      'L2: =SE(J2=K2;"Empate";SE(J2<K2;D2;G2))',
      'Cabo 2,5 mm² deve dar Empate (totais iguais).',
    ],
    expected(row) {
      const qtd = row[2]
      const t1 = qtd * row[4] + row[5]
      const t2 = qtd * row[7] + row[8]
      const decisao = Math.abs(t1 - t2) < 0.02 ? 'Empate' : t1 < t2 ? row[3] : row[6]
      return [t1, t2, decisao]
    },
  },
  {
    id: 'procv',
    title: 'PROCV (no navegador)',
    help: 'Em Preco (coluna C), busque na Base abaixo. Ex.: =PROCV(A2;A14:D21;4;0)',
    headers: ['Codigo', 'Produto', 'Preco'],
    rows: [
      ['003', 'Luva nitrílica G'],
      ['001', 'Parafuso inox M8'],
      ['005', 'Disco de corte'],
      ['002', 'Arruela inox M8'],
      ['007', 'Disjuntor 20A'],
      ['004', 'Mangueira 1/2"'],
      ['008', 'Capacete'],
      ['006', 'Cabo 2,5 mm²'],
    ],
    editableCols: [2],
    lookupTitle: 'Base (não editar)',
    lookupHeaders: ['Codigo', 'Produto', 'Fornecedor', 'Preco'],
    lookupRows: [
      ['001', 'Parafuso inox M8', 'Parafusos BR', 0.95],
      ['002', 'Arruela inox M8', 'MetalMax', 0.15],
      ['003', 'Luva nitrílica G', 'SeguraMais', 7.2],
      ['004', 'Mangueira 1/2"', 'HidroMar', 34],
      ['005', 'Disco de corte', 'CorteSul', 3.9],
      ['006', 'Cabo 2,5 mm²', 'Fios & Cia', 265],
      ['007', 'Disjuntor 20A', 'EletroMar', 45],
      ['008', 'Capacete', 'EPI Total', 32],
    ],
    lookupStartRow: 14,
    hints: [
      'C2: =PROCV(A2;A14:D21;4;0)',
      'Ou: =VLOOKUP(A2;A14:D21;4;0)',
      'Arraste a ideia para C3…C9 mudando A2→A3 etc.',
    ],
    expected(row, sheet) {
      const code = row[0]
      const hit = sheet.lookupRows.find((r) => r[0] === code)
      return [hit[3]]
    },
  },
  {
    id: 'decisao',
    title: 'Decisão + Empate (no navegador)',
    help: 'Totais e Vencedor. Se empatar, a fórmula deve escrever Empate.',
    headers: ['Produto', 'PrecoA', 'FreteA', 'PrecoB', 'FreteB', 'TotalA', 'TotalB', 'Vencedor'],
    rows: [
      ['Luva nitrílica G', 400, 30, 350, 80],
      ['Parafuso inox kit', 95, 25, 110, 0],
      ['Mangueira 1/2"', 680, 45, 620, 90],
      ['Cabo 2,5 mm²', 280, 40, 265, 55],
      ['Capacete', 32, 28, 29, 35],
      ['Disco de corte', 105, 18, 97.5, 25],
      ['Óculos proteção', 125, 20, 140, 5],
      ['Abraçadeira', 40, 10, 35, 15],
    ],
    editableCols: [5, 6, 7],
    hints: [
      'F2: =B2+C2',
      'G2: =D2+E2',
      'H2: =SE(F2<G2;"A";SE(F2>G2;"B";"Empate"))',
    ],
    expected(row) {
      const ta = row[1] + row[2]
      const tb = row[3] + row[4]
      return [ta, tb, pickAB(ta, tb)]
    },
  },
  {
    id: 'desempate',
    title: 'Desempate por prazo (no navegador)',
    help: 'Menor total vence. Se empatar no total, menor prazo vence. Se empatar nos dois → Empate.',
    headers: ['Produto', 'TotalA', 'TotalB', 'PrazoA', 'PrazoB', 'Decisao'],
    rows: [
      ['Luva nitrílica', 430, 440, 5, 3],
      ['Parafuso kit', 120, 110, 7, 10],
      ['Cabo 2,5 mm', 320, 320, 4, 6],
      ['Capacete', 210, 210, 8, 5],
      ['Disco corte', 123, 123, 2, 2],
      ['Mangueira', 710, 710, 10, 10],
      ['Óculos', 145, 140, 3, 9],
      ['Abraçadeira', 56, 56, 1, 4],
    ],
    editableCols: [5],
    hints: [
      'F2: =SE(B2<C2;"A";SE(B2>C2;"B";SE(D2<E2;"A";SE(D2>E2;"B";"Empate"))))',
      'Primeiro compara preço (B×C). Só se empatar, olha prazo (D×E).',
    ],
    expected(row) {
      const [, ta, tb, pa, pb] = row
      let win
      if (ta < tb) win = 'A'
      else if (ta > tb) win = 'B'
      else if (pa < pb) win = 'A'
      else if (pa > pb) win = 'B'
      else win = 'Empate'
      return [win]
    },
  },
  {
    id: 'tres-fornecedores',
    title: 'Três fornecedores (no navegador)',
    help: 'Menor preço entre A/B/C. Se dois tiverem o mínimo → Empate.',
    headers: ['Produto', 'PrecoA', 'PrecoB', 'PrecoC', 'Menor', 'Quem'],
    rows: [
      ['Parafuso M8', 1.1, 0.95, 1.05],
      ['Arruela', 0.18, 0.15, 0.15],
      ['Luva', 8, 7.2, 7.5],
      ['Óculos', 14, 14, 12.5],
      ['Mangueira', 34, 31, 31],
      ['Cabo', 280, 265, 270],
      ['Disjuntor', 45, 48, 45],
      ['Capacete', 32, 29, 30],
    ],
    editableCols: [4, 5],
    hints: [
      'E2: =MIN(B2:D2)',
      'F2: =SE(CONT.SE(B2:D2;E2)>1;"Empate";SE(B2=E2;"A";SE(C2=E2;"B";"C")))',
    ],
    expected(row) {
      const prices = [row[1], row[2], row[3]]
      const min = Math.min(...prices)
      const count = prices.filter((p) => Math.abs(p - min) < 0.02).length
      let quem
      if (count > 1) quem = 'Empate'
      else if (Math.abs(prices[0] - min) < 0.02) quem = 'A'
      else if (Math.abs(prices[1] - min) < 0.02) quem = 'B'
      else quem = 'C'
      return [min, quem]
    },
  },
]
