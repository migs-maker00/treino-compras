export const formulaDrills = [
  {
    id: 'f1',
    prompt: 'Some os preços da coluna E, linhas 2 até 21.',
    hint: 'Use SOMA com intervalo.',
    answers: ['=soma(e2:e21)', '=sum(e2:e21)'],
  },
  {
    id: 'f2',
    prompt: 'Ache o menor preço entre as células E2, F2 e G2.',
    hint: 'Use MÍNIMO / MIN.',
    answers: ['=mínimo(e2:g2)', '=minimo(e2:g2)', '=min(e2:g2)'],
  },
  {
    id: 'f3',
    prompt: 'Se E2 for igual a H2, mostre "Melhor"; senão, em branco.',
    hint: 'Use SE / IF.',
    answers: [
      '=se(e2=h2;"melhor";"")',
      '=se(e2=h2;"melhor";"" )',
      '=if(e2=h2;"melhor";"")',
      '=if(e2=h2,"melhor","")',
      '=se(e2=h2;"melhor";"")',
    ],
  },
  {
    id: 'f4',
    prompt: 'Busque o preço do código em A2 numa tabela chamada Produtos (preço na 4ª coluna).',
    hint: 'PROCV / VLOOKUP com FALSO/FALSE.',
    answers: [
      '=procv(a2;produtos;4;falso)',
      '=procv(a2;produtos;4;false)',
      '=vlookup(a2;produtos;4;falso)',
      '=vlookup(a2;produtos;4;false)',
      '=procv(a2;produtos;4;0)',
      '=vlookup(a2;produtos;4;0)',
    ],
  },
  {
    id: 'f5',
    prompt: 'Conte quantas vezes "Empresa A" aparece na coluna C.',
    hint: 'CONT.SE / COUNTIF.',
    answers: [
      '=cont.se(c:c;"empresa a")',
      '=countif(c:c;"empresa a")',
      '=cont.se(c:c;"Empresa A")',
    ],
  },
  {
    id: 'f6',
    prompt: 'Se F2 < G2 mostre A; se F2 > G2 mostre B; se empatar mostre Empate.',
    hint: 'SE aninhado (um SE dentro do outro).',
    answers: [
      '=se(f2=g2;"empate";se(f2<g2;"a";"b"))',
      '=if(f2=g2;"empate";if(f2<g2;"a";"b"))',
      '=se(f2=g2;"Empate";se(f2<g2;"A";"B"))',
      '=if(f2=g2,"Empate",if(f2<g2,"A","B"))',
      '=se(f2<g2;"a";se(f2>g2;"b";"empate"))',
      '=if(f2<g2;"a";if(f2>g2;"b";"empate"))',
      '=se(f2<g2;"A";se(f2>g2;"B";"Empate"))',
      '=if(f2<g2,"A",if(f2>g2,"B","Empate"))',
    ],
  },
  {
    id: 'f7',
    prompt: 'Total da compra: quantidade em C2 × preço em E2 + frete em F2.',
    hint: 'Multiplicação e soma na mesma fórmula.',
    answers: ['=c2*e2+f2', '=c2*e2+f2'],
  },
]

export function normalizeFormula(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/“|”|"/g, '"')
    .replace(/‘|’/g, "'")
    .replace(/,/g, ';')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function checkFormula(input, answers) {
  const n = normalizeFormula(input)
  return answers.some((a) => normalizeFormula(a) === n)
}

export const searchMissions = [
  {
    id: 's1',
    request: 'mangueira',
    target: 'mangueira hidráulica 1/2" alta pressão SAE 100 R1',
    required: ['mangueira', 'hidraul', '1/2', 'press'],
    optional: ['sae', 'r1', 'metro'],
  },
  {
    id: 's2',
    request: 'parafuso',
    target: 'parafuso sextavado inox M8 x 50 mm',
    required: ['parafuso', 'sextav', 'inox', 'm8'],
    optional: ['50', 'mm'],
  },
  {
    id: 's3',
    request: 'luva',
    target: 'luva nitrílica tamanho G sem pó',
    required: ['luva', 'nitr', 'g'],
    optional: ['sem po', 'sem pó', 'prote'],
  },
  {
    id: 's4',
    request: 'cabo',
    target: 'cabo elétrico 2,5 mm² flexível',
    required: ['cabo', 'eletr', '2,5', 'mm'],
    optional: ['flex'],
  },
  {
    id: 's5',
    request: 'disco',
    target: 'disco de corte 4.1/2" para inox',
    required: ['disco', 'corte', 'inox'],
    optional: ['4', '1/2'],
  },
]

export function scoreSearchQuery(query, mission) {
  const q = String(query || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const reqHits = mission.required.filter((k) => q.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))
  const optHits = (mission.optional || []).filter((k) =>
    q.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')),
  )
  const reqScore = (reqHits.length / mission.required.length) * 80
  const optScore = mission.optional?.length
    ? (optHits.length / mission.optional.length) * 20
    : 20
  const score = Math.round(reqScore + optScore)
  return {
    score,
    reqHits,
    optHits,
    missing: mission.required.filter((k) => !reqHits.includes(k)),
    passed: reqHits.length === mission.required.length && score >= 70,
  }
}

export const emailMissions = [
  {
    id: 'e1',
    templateId: 'cotacao',
    title: 'Pedir cotação',
    brief: 'Peça cotação de mangueira hidráulica 1/2", 20 metros.',
    checks: [
      { id: 'assunto', label: 'Tem assunto claro (cotação/orçamento)', test: (t, s) => /cota|or[cç]amento/i.test(s + t) },
      { id: 'saudacao', label: 'Tem saudação', test: (t) => /bom dia|boa tarde|olá|ola/i.test(t) },
      { id: 'produto', label: 'Cita o produto', test: (t) => /mangueira/i.test(t) },
      { id: 'spec', label: 'Cita especificação (1/2 ou hidráulica)', test: (t) => /1\/2|hidr[aá]ulica/i.test(t) },
      { id: 'qtd', label: 'Cita quantidade', test: (t) => /20|metros|m\b/i.test(t) },
      { id: 'preco', label: 'Pede preço', test: (t) => /pre[cç]o|valor/i.test(t) },
      { id: 'prazo', label: 'Pede prazo', test: (t) => /prazo|entrega/i.test(t) },
      { id: 'disp', label: 'Pede disponibilidade', test: (t) => /dispon/i.test(t) },
      { id: 'fim', label: 'Tem encerramento', test: (t) => /obrigad|atenciosamente|aguardo/i.test(t) },
    ],
  },
  {
    id: 'e2',
    templateId: 'cobranca',
    title: 'Cobrar retorno',
    brief: 'Cobre o orçamento da luva nitrílica G (50 pares) que não retornou.',
    checks: [
      { id: 'assunto', label: 'Assunto de acompanhamento', test: (t, s) => /acompanh|retorno|cota|or[cç]/i.test(s + t) },
      { id: 'saudacao', label: 'Tem saudação', test: (t) => /bom dia|boa tarde|olá|ola/i.test(t) },
      { id: 'produto', label: 'Cita luvas', test: (t) => /luva/i.test(t) },
      { id: 'spec', label: 'Cita nitrílica ou tamanho G', test: (t) => /nitr|tamanho g|\bG\b/i.test(t) },
      { id: 'qtd', label: 'Cita quantidade 50', test: (t) => /50/i.test(t) },
      { id: 'pedido', label: 'Pede retorno/cotação', test: (t) => /retorn|cota|or[cç]|inform/i.test(t) },
      { id: 'fim', label: 'Tem encerramento', test: (t) => /obrigad|atenciosamente|aguardo/i.test(t) },
    ],
  },
  {
    id: 'e3',
    templateId: 'confirmacao',
    title: 'Confirmar pedido',
    brief: 'Confirme pedido de 100 parafusos inox M8 x 40 mm.',
    checks: [
      { id: 'assunto', label: 'Assunto de confirmação/pedido', test: (t, s) => /confirm|pedido/i.test(s + t) },
      { id: 'saudacao', label: 'Tem saudação', test: (t) => /bom dia|boa tarde|olá|ola/i.test(t) },
      { id: 'produto', label: 'Cita parafuso', test: (t) => /parafuso/i.test(t) },
      { id: 'spec', label: 'Cita inox e M8', test: (t) => /inox/i.test(t) && /m8/i.test(t) },
      { id: 'qtd', label: 'Cita 100', test: (t) => /100/i.test(t) },
      { id: 'prazo', label: 'Pede confirmação de prazo', test: (t) => /prazo|entrega|confirm/i.test(t) },
      { id: 'fim', label: 'Tem encerramento', test: (t) => /obrigad|atenciosamente|aguardo/i.test(t) },
    ],
  },
  {
    id: 'e4',
    templateId: 'entrega',
    title: 'Status de entrega',
    brief: 'Pergunte o status da entrega de 100 parafusos sextavados M8 x 40 mm.',
    checks: [
      { id: 'assunto', label: 'Assunto de status/entrega', test: (t, s) => /status|entrega|pedido|acompanh/i.test(s + t) },
      { id: 'saudacao', label: 'Tem saudação', test: (t) => /bom dia|boa tarde|olá|ola/i.test(t) },
      { id: 'produto', label: 'Cita parafuso', test: (t) => /parafuso/i.test(t) },
      { id: 'spec', label: 'Cita M8 ou 40', test: (t) => /m8|40/i.test(t) },
      { id: 'qtd', label: 'Cita 100', test: (t) => /100/i.test(t) },
      { id: 'status', label: 'Pede status/previsão', test: (t) => /status|previs[aã]o|saiu|cheg|rastre/i.test(t) },
      { id: 'fim', label: 'Tem encerramento', test: (t) => /obrigad|atenciosamente|aguardo/i.test(t) },
    ],
  },
  {
    id: 'e5',
    templateId: 'divergencia',
    title: 'Avisar divergência',
    brief: 'Avisar o fornecedor: pediu 50 pares de luva nitrílica G e chegaram só 40.',
    checks: [
      { id: 'assunto', label: 'Assunto de divergência/recebimento', test: (t, s) => /diverg|receb|falta|pedido|luva/i.test(s + t) },
      { id: 'saudacao', label: 'Tem saudação', test: (t) => /bom dia|boa tarde|olá|ola/i.test(t) },
      { id: 'produto', label: 'Cita luva', test: (t) => /luva/i.test(t) },
      { id: 'pedido', label: 'Cita o que foi pedido (50)', test: (t) => /50|pedido/i.test(t) },
      { id: 'chegou', label: 'Cita o que chegou (40)', test: (t) => /40|cheg|falt/i.test(t) },
      { id: 'acao', label: 'Pede regularizar/verificar', test: (t) => /regular|verific|repor|envio|faltante|resolver/i.test(t) },
      { id: 'fim', label: 'Tem encerramento', test: (t) => /obrigad|atenciosamente|aguardo/i.test(t) },
    ],
  },
  {
    id: 'e6',
    templateId: 'esclarecer',
    title: 'Esclarecer pedido',
    brief: 'Alguém pediu só “mangueira”. Escreva pedindo medida, tipo, quantidade e prazo antes de cotar.',
    checks: [
      { id: 'assunto', label: 'Assunto de esclarecimento', test: (t, s) => /esclarec|informa|pedido|mangueira|d[uú]vida/i.test(s + t) },
      { id: 'saudacao', label: 'Tem saudação', test: (t) => /bom dia|boa tarde|olá|ola/i.test(t) },
      { id: 'vago', label: 'Menciona que o pedido está incompleto/vago', test: (t) => /vago|falt|especif|confirma|esclarec|dados/i.test(t) },
      { id: 'medida', label: 'Pede medida', test: (t) => /medida|1\/2|polegada|di[aâ]metro/i.test(t) },
      { id: 'tipo', label: 'Pede tipo/uso', test: (t) => /tipo|hidr|uso|aplica/i.test(t) },
      { id: 'qtd', label: 'Pede quantidade', test: (t) => /quant|metro/i.test(t) },
      { id: 'prazo', label: 'Pede prazo necessário', test: (t) => /prazo|quando|urg/i.test(t) },
      { id: 'fim', label: 'Tem encerramento', test: (t) => /obrigad|atenciosamente|aguardo/i.test(t) },
    ],
  },
]

export const receivingExtra = [
  {
    id: 4,
    pedido: [
      { item: 'Disco de corte 4.1/2"', qtd: 25 },
      { item: 'Óculos de proteção', qtd: 5 },
    ],
    chegou: [
      { item: 'Disco de corte 4.1/2"', qtd: 25 },
      { item: 'Óculos de proteção', qtd: 5 },
    ],
    nf: { itensOk: true, valorOk: false, obs: 'Valor unitário do disco diferente do pedido' },
    estado: 'ok',
    problemas: ['nf-valor'],
    options: ['ok', 'nf-valor', 'danificado', 'marca'],
  },
  {
    id: 5,
    pedido: [{ item: 'Capacete com jugular', qtd: 6 }],
    chegou: [{ item: 'Capacete com jugular', qtd: 6 }],
    nf: { itensOk: true, valorOk: true },
    estado: 'danificado',
    problemas: ['danificado'],
    options: ['ok', 'danificado', 'qtd', 'marca'],
  },
  {
    id: 6,
    pedido: [{ item: 'Luva nitrílica G marca SeguraMais', qtd: 50 }],
    chegou: [{ item: 'Luva nitrílica G marca Genérica', qtd: 50 }],
    nf: { itensOk: true, valorOk: true },
    estado: 'ok',
    problemas: ['marca'],
    options: ['ok', 'marca', 'qtd', 'danificado'],
  },
  {
    id: 7,
    pedido: [{ item: 'Mangueira hidráulica 1/2"', qtd: 20, unidade: 'm' }],
    chegou: [{ item: 'Mangueira hidráulica 1/2"', qtd: 20, unidade: 'un.' }],
    nf: { itensOk: false, valorOk: true, obs: 'NF em unidades, pedido em metros' },
    estado: 'ok',
    problemas: ['unidade'],
    options: ['ok', 'unidade', 'produto-errado', 'qtd'],
  },
  {
    id: 8,
    pedido: [
      { item: 'Parafuso inox M8x40', qtd: 100 },
      { item: 'Arruela inox M8', qtd: 100 },
    ],
    chegou: [
      { item: 'Parafuso inox M8x40', qtd: 60 },
      { item: 'Arruela inox M8', qtd: 100 },
    ],
    nf: { itensOk: true, valorOk: true },
    estado: 'ok',
    problemas: ['parcial'],
    options: ['ok', 'parcial', 'produto-errado', 'danificado'],
  },
  {
    id: 9,
    pedido: [{ item: 'Código 001 — Parafuso inox M8', qtd: 50 }],
    chegou: [{ item: 'Código 007 — Parafuso inox M8', qtd: 50 }],
    nf: { itensOk: false, valorOk: true, obs: 'Código divergente' },
    estado: 'ok',
    problemas: ['codigo'],
    options: ['ok', 'codigo', 'qtd', 'marca'],
  },
  {
    id: 10,
    pedido: [{ item: 'Registro esfera 1/2"', qtd: 4, preco: 24 }],
    chegou: [{ item: 'Registro esfera 1/2"', qtd: 4, preco: 31 }],
    nf: { itensOk: true, valorOk: false, obs: 'Preço NF R$ 31 vs pedido R$ 24' },
    estado: 'ok',
    problemas: ['nf-preco'],
    options: ['ok', 'nf-preco', 'produto-errado', 'qtd'],
  },
]

export const receivingOptionLabels = {
  ok: 'Sem divergência',
  'faltam-luvas': 'Faltam 2 luvas nitrílicas G',
  'produto-errado': 'Produto errado / especificação diferente',
  nf: 'Nota fiscal não bate',
  'nf-valor': 'Valor da NF diverge do pedido',
  'nf-preco': 'Preço da NF diferente do pedido',
  danificado: 'Produto danificado',
  marca: 'Marca diferente da pedida',
  unidade: 'Unidade de medida errada',
  parcial: 'Recebimento parcial (faltou quantidade)',
  codigo: 'Código do produto divergente',
  qtd: 'Quantidade divergente',
}

export const materialSpecs = [
  {
    id: 'm1',
    label: 'Parafuso sextavado inox M8 × 50 mm',
    fields: [
      { key: 'tipo', label: 'Tipo', answer: 'sextavado' },
      { key: 'material', label: 'Material', answer: 'inox' },
      { key: 'diametro', label: 'Diâmetro', answer: 'm8' },
      { key: 'comp', label: 'Comprimento', answer: '50' },
    ],
  },
  {
    id: 'm2',
    label: 'Mangueira hidráulica SAE 100 R1 1/2" 20 m',
    fields: [
      { key: 'tipo', label: 'Tipo', answer: 'hidraulica' },
      { key: 'norma', label: 'Norma', answer: 'sae 100 r1' },
      { key: 'diam', label: 'Diâmetro', answer: '1/2' },
      { key: 'comp', label: 'Comprimento', answer: '20' },
    ],
  },
  {
    id: 'm3',
    label: 'Luva nitrílica G sem pó',
    fields: [
      { key: 'tipo', label: 'Tipo/material', answer: 'nitrilica' },
      { key: 'tam', label: 'Tamanho', answer: 'g' },
      { key: 'det', label: 'Detalhe', answer: 'sem po' },
    ],
  },
  {
    id: 'm4',
    label: 'Cabo elétrico flexível 2,5 mm²',
    fields: [
      { key: 'tipo', label: 'Tipo', answer: 'eletrico' },
      { key: 'bitola', label: 'Bitola', answer: '2,5' },
      { key: 'forma', label: 'Forma', answer: 'flexivel' },
    ],
  },
]

export function normText(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/×/g, 'x')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchLoose(input, answer) {
  const a = normText(answer)
  const i = normText(input)
  return i.includes(a) || a.includes(i)
}

export const mindsetDrills = [
  {
    id: 'md1',
    request: 'Preciso de 30 parafusos.',
    expected: ['tipo', 'material', 'medida', 'comprimento', 'aplicacao', 'quantidade'],
    synonyms: {
      tipo: ['tipo', 'sextavado', 'allen', 'philips', 'cabeça', 'cabeca'],
      material: ['material', 'inox', 'aço', 'aco', 'carbono'],
      medida: ['medida', 'm6', 'm8', 'm10', 'diâmetro', 'diametro', 'rosca'],
      comprimento: ['comprimento', 'mm', '30 mm', '50 mm', 'tamanho'],
      aplicacao: ['aplica', 'onde', 'uso', 'para que'],
      quantidade: ['quantidade', 'qtd', '30', 'unidades', 'quantos'],
    },
  },
  {
    id: 'md2',
    request: 'Preciso de 20 metros de mangueira.',
    expected: ['tipo', 'diametro', 'pressao', 'temperatura', 'material', 'conexao', 'aplicacao'],
    synonyms: {
      tipo: ['tipo', 'agua', 'ar', 'combustivel', 'oleo', 'óleo', 'hidraul'],
      diametro: ['diâmetro', 'diametro', '1/2', 'medida', 'polegada'],
      pressao: ['pressao', 'pressão', 'bar', 'psi', 'alta pressao'],
      temperatura: ['temperatura', 'calor', 'graus'],
      material: ['material', 'borracha', 'pvc', 'inox'],
      conexao: ['conexao', 'conexão', 'engate', 'rosca', 'terminal'],
      aplicacao: ['aplica', 'onde', 'uso', 'navio', 'maquina'],
    },
  },
  {
    id: 'md3',
    request: 'Manda 50 luvas.',
    expected: ['material', 'tamanho', 'uso', 'descartavel', 'norma'],
    synonyms: {
      material: ['material', 'latex', 'látex', 'nitril', 'vaqueta'],
      tamanho: ['tamanho', 'p', 'm', 'g', 'gg'],
      uso: ['uso', 'quimico', 'químico', 'mecanico', 'mecânico', 'geral'],
      descartavel: ['descart', 'reutil'],
      norma: ['norma', 'ca', 'certific'],
    },
  },
]

export function scoreMindsetAnswers(text, drill) {
  const lines = String(text || '')
    .split(/\n|;|\|/)
    .map((l) => l.trim())
    .filter(Boolean)
  const blob = normText(text)
  const found = []
  for (const key of drill.expected) {
    const words = drill.synonyms[key] || [key]
    if (words.some((w) => blob.includes(normText(w)))) found.push(key)
  }
  const score = Math.round((found.length / drill.expected.length) * 100)
  return {
    score,
    found,
    missing: drill.expected.filter((k) => !found.includes(k)),
    lines: lines.length,
    passed: found.length >= Math.ceil(drill.expected.length * 0.7) && lines.length >= 4,
  }
}

export const cotacaoRows = [
  {
    produto: 'Luva nitrílica G',
    qtd: 50,
    a: { nome: 'EPI Total', preco: 400, frete: 30, prazo: 2, qualidade: 4, disponivel: true },
    b: { nome: 'SeguraMais', preco: 350, frete: 80, prazo: 5, qualidade: 3, disponivel: true },
    c: { nome: 'ProtegeJá', preco: 420, frete: 0, prazo: 1, qualidade: 4, disponivel: true },
    best: 'c',
    reason: 'C: melhor equilíbrio (frete zero, 1 dia, boa qualidade). B é mais barato no produto, mas frete+prazo pioram.',
  },
  {
    produto: 'Parafuso inox M8x40',
    qtd: 100,
    a: { nome: 'Parafusos BR', preco: 95, frete: 25, prazo: 2, qualidade: 4, disponivel: true },
    b: { nome: 'FixNaval', preco: 110, frete: 0, prazo: 1, qualidade: 5, disponivel: true },
    c: { nome: 'MetalMax', preco: 70, frete: 20, prazo: 1, qualidade: 1, disponivel: true, obs: 'Aço zincado (material errado)' },
    best: 'b',
    reason: 'B entrega material correto + frete grátis. C é barato, mas material errado = compra ruim.',
  },
  {
    produto: 'Mangueira hidráulica 1/2"',
    qtd: 20,
    a: { nome: 'HidroMar', preco: 680, frete: 45, prazo: 3, qualidade: 4, disponivel: true },
    b: { nome: 'TuboSul', preco: 620, frete: 90, prazo: 7, qualidade: 3, disponivel: true },
    c: { nome: 'BaratoJá', preco: 500, frete: 40, prazo: 2, qualidade: 2, disponivel: false, obs: 'Sem estoque' },
    best: 'a',
    reason: 'A: disponível, boa especificação e prazo. C parece barato, mas não tem estoque.',
  },
]

export function supplierScore(s) {
  if (!s.disponivel) return -999
  const total = s.preco + s.frete
  // lower total better, faster prazo better, higher qualidade better
  return s.qualidade * 40 - total / 10 - s.prazo * 8
}

export const dayMissions = [
  {
    id: 'day1',
    hour: '08:14',
    channel: '📧 Pedido',
    text: 'Precisamos de uma mangueira para o navio.',
    missing: ['diametro', 'comprimento', 'aplicacao', 'pressao', 'material'],
    distractors: ['cor', 'cheiro'],
  },
  {
    id: 'day2',
    hour: '10:05',
    channel: '💬 WhatsApp',
    text: 'Manda uns parafusos aí urgente.',
    missing: ['tipo', 'material', 'medida', 'comprimento', 'quantidade'],
    distractors: ['cor da caixa', 'marca do celular'],
  },
  {
    id: 'day3',
    hour: '14:40',
    channel: '📞 Ligação',
    text: 'Preciso de EPI para o pessoal do deck.',
    missing: ['tipo-epi', 'tamanho', 'quantidade', 'norma'],
    distractors: ['cor preferida', 'sabor'],
  },
]

export const dayMissingLabels = {
  diametro: 'Diâmetro',
  comprimento: 'Comprimento',
  aplicacao: 'Aplicação',
  pressao: 'Pressão',
  material: 'Material',
  cor: 'Cor',
  cheiro: 'Cheiro',
  tipo: 'Tipo de parafuso',
  medida: 'Medida (M6/M8…)',
  quantidade: 'Quantidade',
  'cor da caixa': 'Cor da caixa',
  'marca do celular': 'Marca do celular',
  'tipo-epi': 'Qual EPI (luva/óculos/capacete…)',
  tamanho: 'Tamanho',
  norma: 'Norma / CA',
  'cor preferida': 'Cor preferida',
  sabor: 'Sabor',
}
