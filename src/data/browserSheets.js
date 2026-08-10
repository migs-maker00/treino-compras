/** Exercícios de planilha no navegador (não precisa de Excel/chave). */

export const browserSheets = [
  {
    id: 'cotacao',
    title: 'Cotação (no navegador)',
    help: 'Nas células amarelas, digite fórmulas como no Excel. Ex.: =C2*E2+F2 e =MIN(J2:K2)',
    headers: ['Produto', 'Spec', 'Qtd', 'Forn1', 'Preco1', 'Frete1', 'Forn2', 'Preco2', 'Frete2', 'Total1', 'Total2', 'Melhor'],
    // row 0 = header visually; data starts row 1 in 0-based sheet row index for body
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
    editableCols: [9, 10, 11], // J K L (0-based)
    hints: [
      'J2: =C2*E2+F2   (Qtd × Preço1 + Frete1)',
      'K2: =C2*H2+I2   (Qtd × Preço2 + Frete2)',
      'L2: =MIN(J2:K2)  ou  =MÍNIMO(J2:K2)  — menor total (número)',
      'Depois arraste a lógica mentalmente para as outras linhas (copie ajustando o número da linha).',
    ],
    expected(row) {
      const qtd = row[2]
      const preco1 = row[4]
      const frete1 = row[5]
      const preco2 = row[7]
      const frete2 = row[8]
      const t1 = qtd * preco1 + frete1
      const t2 = qtd * preco2 + frete2
      return [t1, t2, Math.min(t1, t2)]
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
    // lookup placed starting at row 14 in sheet (1-based)
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
    title: 'Decisão com SE (no navegador)',
    help: 'TotalA, TotalB e Vencedor (A ou B). Em empate, SE(F2<G2;"A";"B") escolhe B.',
    headers: ['Produto', 'PrecoA', 'FreteA', 'PrecoB', 'FreteB', 'TotalA', 'TotalB', 'Vencedor'],
    rows: [
      ['Luva nitrílica G', 400, 30, 350, 80],
      ['Parafuso inox kit', 95, 25, 110, 0],
      ['Mangueira 1/2"', 680, 45, 620, 90],
      ['Cabo 2,5 mm²', 280, 40, 265, 55],
      ['Capacete', 32, 28, 29, 35],
      ['Disco de corte', 105, 18, 97.5, 25],
    ],
    editableCols: [5, 6, 7],
    hints: [
      'F2: =B2+C2',
      'G2: =D2+E2',
      'H2: =SE(F2<G2;"A";"B")  ou  =IF(F2<G2;"A";"B")',
    ],
    expected(row) {
      const ta = row[1] + row[2]
      const tb = row[3] + row[4]
      return [ta, tb, ta < tb ? 'A' : 'B']
    },
  },
]
