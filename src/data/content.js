export const modules = [
  {
    id: 'pesquisa',
    icon: '🔎',
    title: 'Pesquisa e cotação',
    short: 'Achar fornecedor certo no PC e comparar opções',
    priority: 'Dia a dia nº 1',
    color: 'steel',
  },
  {
    id: 'email',
    icon: '📧',
    title: 'E-mail profissional',
    short: 'Cotação, cobrança, confirmação e status de entrega',
    priority: 'Caixa de entrada',
    color: 'copper',
  },
  {
    id: 'recebimento',
    icon: '📦',
    title: 'Recebimento e conferência',
    short: 'Separar, conferir e bater pedido × mercadoria × NF',
    priority: 'Operação diária',
    color: 'teal',
  },
  {
    id: 'excel',
    icon: '🖥️',
    title: 'Excel para cotação',
    short: 'Só o necessário: comparar preços, frete e empate',
    priority: 'Apoio no PC',
    color: 'teal',
  },
  {
    id: 'materiais',
    icon: '⚓',
    title: 'Materiais e categorias',
    short: 'Ferragens, hidráulica, EPI e mais',
    priority: 'Conhecer o produto',
    color: 'steel',
  },
  {
    id: 'mentalidade',
    icon: '🧠',
    title: 'Pensar como comprador',
    short: 'Perguntas certas antes de comprar ou aceitar',
    priority: 'Critério',
    color: 'copper',
  },
]

export const weekPlan = [
  {
    day: 1,
    title: 'Pesquisa de fornecedores',
    time: '1–2h',
    module: 'pesquisa',
    tasks: [
      'Transformar pedido vago em busca específica',
      'Achar 2–3 fornecedores por item',
      'Anotar preço, frete, prazo e disponibilidade',
      'Comparar e escolher a melhor opção',
    ],
  },
  {
    day: 2,
    title: 'E-mail do dia a dia',
    time: '1–2h',
    module: 'email',
    tasks: [
      'Pedir cotação',
      'Cobrar retorno',
      'Confirmar pedido',
      'Acompanhar entrega e avisar divergência',
    ],
  },
  {
    day: 3,
    title: 'Recebimento e conferência',
    time: '1–2h',
    module: 'recebimento',
    tasks: [
      'Conferir produto, quantidade e especificação',
      'Bater mercadoria com NF e pedido',
      'Treinar casos: falta, erro, danificado, parcial',
      'Saber o que fazer quando não bate',
    ],
  },
  {
    day: 4,
    title: 'Excel só para cotação',
    time: '1–2h',
    module: 'excel',
    tasks: [
      'Montar tabela simples de cotação',
      'Calcular total (qtd × preço + frete)',
      'Marcar melhor opção ou Empate',
      'Opcional: PROCV / desempate por prazo',
    ],
  },
  {
    day: 5,
    title: 'Materiais',
    time: '1–2h',
    module: 'materiais',
    tasks: [
      'Ferragens e ferramentas',
      'Hidráulica e elétrica',
      'EPI e consumíveis',
      'Quiz rápido de categorias',
    ],
  },
  {
    day: 6,
    title: 'Critério de comprador',
    time: '1h',
    module: 'mentalidade',
    tasks: [
      'Perguntas antes de comprar',
      'Quando pedir esclarecimento por e-mail',
      'Revisar termos: NF, frete, prazo, disponibilidade',
    ],
  },
  {
    day: 7,
    title: 'Simulação do dia',
    time: '1–2h',
    module: 'simulacao',
    tasks: [
      'Entender o pedido',
      'Pesquisar e comparar fornecedores',
      'Escolher a melhor opção',
      'Conferir o que chegou',
    ],
  },
]

export const excelBasics = [
  { title: 'Criar e organizar planilhas', tip: 'Nomeie abas com clareza: Cotação, Fornecedores, Pedidos.' },
  { title: 'Linhas e colunas', tip: 'Cada linha = um item. Cada coluna = um tipo de informação.' },
  { title: 'Filtros', tip: 'Use para achar rápido: só um fornecedor, só um tipo de produto.' },
  { title: 'Ordenar A → Z', tip: 'Ordene por preço, prazo ou nome para comparar.' },
  { title: 'Localizar (Ctrl+F)', tip: 'Ache códigos e nomes sem rolar a planilha inteira. No Excel em português, também pode ser Ctrl+L.' },
  { title: 'Congelar cabeçalho', tip: 'Exibir → Congelar painéis. O título fica visível ao rolar.' },
  { title: 'Formatação de células', tip: 'Moeda (R$), percentuais e datas bem formatadas evitam erro.' },
  { title: 'Tabelas', tip: 'Ctrl+T transforma o intervalo em tabela com filtros automáticos.' },
  { title: 'Várias abas', tip: 'Separe: Lista de produtos | Cotações | Contatos.' },
  { title: 'PDF ↔ Excel', tip: 'Exporte cotações em PDF para enviar; importe listas quando possível.' },
]

export const excelFormulas = [
  { name: '=SOMA()', use: 'Somar totais de preços ou quantidades.', example: '=SOMA(E2:E21)' },
  { name: '=MÉDIA()', use: 'Ver preço médio entre fornecedores.', example: '=MÉDIA(E2:G2)' },
  { name: '=MÍNIMO()', use: 'Achar o menor preço da linha.', example: '=MÍNIMO(E2:G2)' },
  { name: '=MÁXIMO()', use: 'Ver o preço mais alto (alerta).', example: '=MÁXIMO(E2:G2)' },
  { name: '=SE()', use: 'Marcar automaticamente o melhor preço.', example: '=SE(E2=H2;"Melhor";"")' },
  {
    name: '=SE() aninhado',
    use: 'Decidir A, B ou Empate quando os totais empatam.',
    example: '=SE(F2=G2;"Empate";SE(F2<G2;"A";"B"))',
  },
  { name: '=CONT.SE()', use: 'Contar quantos itens um fornecedor tem.', example: '=CONT.SE(C:C;"Empresa A")' },
  { name: '=PROCV()', use: 'Buscar preço/fornecedor pelo código do produto.', example: '=PROCV(A2;Tabela;4;FALSO)' },
  { name: '=PROCX()', use: 'Versão moderna do PROCV — mais flexível.', example: '=PROCX(A2;códigos;preços)' },
]

export const glossary = [
  { term: 'Cotação', def: 'Pedir preço de um produto ou serviço.' },
  { term: 'Orçamento', def: 'Proposta de preço enviada pelo fornecedor.' },
  { term: 'Fornecedor', def: 'Quem vende / fornece o produto.' },
  { term: 'Cliente', def: 'Quem compra (a empresa ou o navio).' },
  { term: 'Pedido de compra / PO', def: 'Solicitação formal de compra.' },
  { term: 'NF / Nota Fiscal', def: 'Documento fiscal da mercadoria.' },
  { term: 'Prazo de entrega', def: 'Quanto tempo demora para chegar.' },
  { term: 'Frete', def: 'Custo do transporte.' },
  { term: 'Disponibilidade', def: 'Se o fornecedor tem o produto em estoque.' },
  { term: 'Lead time', def: 'Tempo entre solicitar/comprar e receber.' },
  { term: 'Pagamento à vista', def: 'Paga imediatamente.' },
  { term: 'Pagamento a prazo', def: 'Paga depois, conforme condição negociada.' },
]

export const searchTips = {
  bad: ['mangueira', 'parafuso', 'luva', 'cabo'],
  good: [
    'mangueira hidráulica 1/2" alta pressão',
    'mangueira hidráulica SAE 100 R1 10 metros',
    'parafuso sextavado inox M8 x 50 mm',
    'luva nitrílica tamanho G sem pó',
    'cabo elétrico 2,5 mm² flexível',
  ],
  checklist: [
    'Quem vende',
    'Preço unitário e total',
    'Quantidade mínima',
    'Prazo de entrega',
    'Frete',
    'Disponibilidade',
    'Marca',
    'Especificação técnica',
    'Condição de pagamento',
  ],
}

export const emailTemplates = [
  {
    id: 'cotacao',
    title: 'Solicitação de cotação',
    subject: 'Solicitação de cotação – Mangueira hidráulica',
    body: `Bom dia,

Gostaria de solicitar cotação para o seguinte item:

• Mangueira hidráulica
• Medida: 1/2"
• Quantidade: 20 metros

Favor informar preço, disponibilidade e prazo de entrega.

Obrigado.`,
  },
  {
    id: 'cobranca',
    title: 'Cobrança de orçamento',
    subject: 'Acompanhamento – cotação mangueira hidráulica',
    body: `Bom dia,

Passando para acompanhar a cotação solicitada referente à mangueira hidráulica 1/2", 20 metros.

Poderiam nos retornar com preço, prazo e disponibilidade?

Obrigado.`,
  },
  {
    id: 'confirmacao',
    title: 'Confirmação de pedido',
    subject: 'Confirmação de pedido – Luvas de proteção',
    body: `Bom dia,

Confirmamos o pedido abaixo:

• Produto: Luva de proteção nitrílica G
• Quantidade: 50 pares
• Valor: conforme orçamento enviado
• Entrega: endereço da empresa

Favor confirmar o recebimento deste pedido e o prazo de entrega.

Atenciosamente.`,
  },
  {
    id: 'entrega',
    title: 'Acompanhamento de entrega',
    subject: 'Status da entrega – Pedido de parafusos M8',
    body: `Bom dia,

Gostaríamos de saber o status da entrega do pedido de parafusos sextavados M8 x 40 mm (100 un.).

Já saiu para entrega? Previsão de chegada?

Obrigado.`,
  },
  {
    id: 'divergencia',
    title: 'Avisar divergência no recebimento',
    subject: 'Divergência no recebimento – Pedido luvas nitrílicas G',
    body: `Bom dia,

Recebemos o pedido de luvas nitrílicas G (50 pares) e encontramos divergência:

• Pedido: 50 pares
• Chegou: 40 pares

Podem verificar e nos informar como vão regularizar a falta?

Obrigado.`,
  },
  {
    id: 'esclarecer',
    title: 'Pedir esclarecimento do pedido',
    subject: 'Esclarecimento de pedido – mangueira',
    body: `Bom dia,

Recebemos a solicitação de “mangueira”, mas faltam dados para cotar certo.

Podem confirmar:
• Medida (ex.: 1/2")
• Tipo (hidráulica / uso)
• Quantidade (metros)
• Prazo necessário

Assim pesquisamos o item correto.

Obrigado.`,
  },
]

export const receivingChecks = [
  { id: 1, title: 'Produto', q: 'É exatamente o que foi pedido?' },
  { id: 2, title: 'Quantidade', q: 'Veio tudo?' },
  { id: 3, title: 'Especificação', q: 'Tamanho, modelo e material corretos?' },
  { id: 4, title: 'Estado', q: 'Está danificado?' },
  { id: 5, title: 'Nota fiscal', q: 'Os dados batem?' },
  { id: 6, title: 'Pedido', q: 'Corresponde ao que foi comprado?' },
]

export const receivingScenarios = [
  {
    id: 1,
    pedido: [
      { item: 'Parafuso inox M8', qtd: 50 },
      { item: 'Arruela inox M8', qtd: 20 },
      { item: 'Luva nitrílica G', qtd: 10 },
    ],
    chegou: [
      { item: 'Parafuso inox M8', qtd: 50 },
      { item: 'Arruela inox M8', qtd: 20 },
      { item: 'Luva nitrílica G', qtd: 8 },
    ],
    problemas: ['Faltam 2 luvas nitrílicas G'],
  },
  {
    id: 2,
    pedido: [
      { item: 'Mangueira hidráulica 1/2"', qtd: 20, unidade: 'm' },
      { item: 'Abraçadeira 1/2"', qtd: 10 },
    ],
    chegou: [
      { item: 'Mangueira de água 1/2"', qtd: 20, unidade: 'm' },
      { item: 'Abraçadeira 1/2"', qtd: 10 },
    ],
    problemas: ['Produto errado: veio mangueira de água em vez de hidráulica'],
  },
  {
    id: 3,
    pedido: [
      { item: 'Disco de corte 4.1/2"', qtd: 25 },
      { item: 'Óculos de proteção', qtd: 5 },
    ],
    chegou: [
      { item: 'Disco de corte 4.1/2"', qtd: 25 },
      { item: 'Óculos de proteção', qtd: 5 },
    ],
    problemas: [],
  },
]

export const materialCategories = [
  {
    id: 'ferragens',
    icon: '🔩',
    title: 'Ferragens',
    items: ['Parafusos', 'Porcas', 'Arruelas', 'Abraçadeiras', 'Buchas', 'Pregos', 'Grampos'],
  },
  {
    id: 'ferramentas',
    icon: '🔧',
    title: 'Ferramentas',
    items: ['Chave de boca', 'Chave combinada', 'Chave inglesa', 'Chave Allen', 'Alicate', 'Martelo', 'Torquímetro', 'Furadeira', 'Esmerilhadeira', 'Serra'],
  },
  {
    id: 'eletrica',
    icon: '⚡',
    title: 'Elétrica',
    items: ['Cabos', 'Fios', 'Tomadas', 'Disjuntores', 'Conectores', 'Terminais', 'Fita isolante', 'Extensões'],
  },
  {
    id: 'hidraulica',
    icon: '💧',
    title: 'Hidráulica',
    items: ['Mangueiras', 'Tubos', 'Conexões', 'Registros', 'Válvulas', 'Adaptadores', 'Abraçadeiras'],
  },
  {
    id: 'epi',
    icon: '🦺',
    title: 'EPI',
    items: ['Luvas', 'Óculos', 'Capacete', 'Protetor auricular', 'Botas', 'Máscara', 'Cinto de segurança'],
  },
  {
    id: 'consumiveis',
    icon: '🛠️',
    title: 'Consumíveis',
    items: ['Discos de corte', 'Discos de desbaste', 'Lixas', 'Brocas', 'Fitas', 'Adesivos', 'Selantes', 'Lubrificantes'],
  },
]

export const mindsetCases = [
  {
    id: 1,
    request: 'Preciso de 30 parafusos.',
    wrong: 'Pesquisar só "parafuso".',
    questions: [
      'Material: inox ou aço carbono?',
      'Tipo: sextavado, Allen ou Philips?',
      'Medida: M6, M8 ou M10?',
      'Comprimento: 30 mm, 50 mm…?',
      'Rosca: qual?',
      'Quantidade: 30 unidades?',
      'Aplicação: onde será usado?',
    ],
  },
  {
    id: 2,
    request: 'Preciso de 20 metros de mangueira.',
    wrong: 'Pesquisar só "mangueira".',
    questions: [
      'Tipo: água, ar, combustível, óleo ou hidráulica?',
      'Qual diâmetro?',
      'Qual pressão de trabalho?',
      'Qual temperatura?',
      'Qual material?',
      'Qual conexão?',
      'Para qual aplicação?',
    ],
  },
  {
    id: 3,
    request: 'Manda 50 luvas.',
    wrong: 'Comprar a luva mais barata sem especificação.',
    questions: [
      'Material: látex, nitrílica, vaqueta…?',
      'Tamanho: P, M, G, GG?',
      'Com ou sem pó?',
      'Uso: químico, mecânico, geral?',
      'Descartável ou reutilizável?',
      'Norma / CA exigido?',
    ],
  },
]

export const quizMaterials = [
  {
    q: 'Disco de corte e lixa pertencem a qual categoria?',
    options: ['Ferragens', 'Consumíveis', 'EPI', 'Elétrica'],
    answer: 1,
  },
  {
    q: 'Mangueira, válvula e conexão são tipicamente…',
    options: ['Elétrica', 'EPI', 'Hidráulica', 'Papelaria'],
    answer: 2,
  },
  {
    q: 'Capacete, óculos e protetor auricular são…',
    options: ['Ferramentas', 'Consumíveis', 'Ferragens', 'EPI'],
    answer: 3,
  },
  {
    q: 'Parafuso, porca e arruela são…',
    options: ['Ferragens', 'Elétrica', 'Hidráulica', 'EPI'],
    answer: 0,
  },
  {
    q: 'Disjuntor e terminal elétrico são…',
    options: ['Hidráulica', 'Elétrica', 'Ferragens', 'Consumíveis'],
    answer: 1,
  },
]

export const quizMindset = [
  {
    q: 'Alguém pede "10 metros de mangueira". Qual a melhor primeira ação?',
    options: [
      'Comprar a mais barata no Mercado Livre',
      'Perguntar tipo, diâmetro, pressão e aplicação',
      'Pedir 15 metros por precaução',
      'Esperar o fornecedor adivinhar',
    ],
    answer: 1,
  },
  {
    q: 'Menor preço unitário sempre é a melhor compra?',
    options: [
      'Sim, sempre',
      'Não — considere frete, prazo, qualidade e disponibilidade',
      'Só se for à vista',
      'Só se for importado',
    ],
    answer: 1,
  },
  {
    q: 'O que é lead time?',
    options: [
      'Desconto no frete',
      'Tempo entre solicitar/comprar e receber',
      'Número da nota fiscal',
      'Nome do fornecedor',
    ],
    answer: 1,
  },
  {
    q: 'Na conferência chegaram 8 luvas de 10 pedidas. O que fazer?',
    options: [
      'Ignorar a diferença',
      'Registrar divergência e comunicar',
      'Jogar as 8 fora',
      'Aceitar e alterar o pedido sem avisar',
    ],
    answer: 1,
  },
]

export const simulationProducts = [
  {
    id: 'luvas',
    pedido: 'O comandante precisa de 50 pares de luvas de proteção para o deck.',
    produto: 'Luva de proteção',
    specsNeeded: ['Material', 'Tamanho', 'Tipo de uso'],
    suppliers: [
      { key: 'A', nome: 'Fornecedor A', produto: 'Luva X nitrílica G', preco: 400, frete: 30, prazo: 2, qualidade: 'Boa' },
      { key: 'B', nome: 'Fornecedor B', produto: 'Luva Y nitrílica G', preco: 350, frete: 80, prazo: 5, qualidade: 'Média' },
      { key: 'C', nome: 'Fornecedor C', produto: 'Luva Z nitrílica G', preco: 420, frete: 0, prazo: 1, qualidade: 'Boa' },
    ],
    best: 'C',
    reason: 'Custo total competitivo, frete grátis e entrega em 1 dia — melhor equilíbrio.',
  },
  {
    id: 'mangueira',
    pedido: 'Precisamos de 20 metros de mangueira hidráulica 1/2" alta pressão.',
    produto: 'Mangueira hidráulica 1/2"',
    specsNeeded: ['Diâmetro', 'Pressão', 'Comprimento', 'Norma'],
    suppliers: [
      { key: 'A', nome: 'HidroMar', produto: 'SAE 100 R1 1/2"', preco: 680, frete: 45, prazo: 3, qualidade: 'Boa' },
      { key: 'B', nome: 'TuboSul', produto: 'SAE 100 R1 1/2"', preco: 620, frete: 90, prazo: 7, qualidade: 'Média' },
      { key: 'C', nome: 'Náutica Parts', produto: 'SAE 100 R2 1/2"', preco: 750, frete: 0, prazo: 2, qualidade: 'Ótima' },
    ],
    best: 'A',
    reason: 'HidroMar: boa especificação, prazo razoável e melhor custo total entre opções equivalentes R1.',
  },
  {
    id: 'parafusos',
    pedido: 'Solicitam 100 parafusos sextavados inox M8 x 40 mm.',
    produto: 'Parafuso sextavado inox M8x40',
    specsNeeded: ['Material inox', 'M8', '40 mm', 'Sextavado'],
    suppliers: [
      { key: 'A', nome: 'Parafusos BR', produto: 'Inox A2 M8x40', preco: 95, frete: 25, prazo: 2, qualidade: 'Boa' },
      { key: 'B', nome: 'FixNaval', produto: 'Inox A2 M8x40', preco: 110, frete: 0, prazo: 1, qualidade: 'Ótima' },
      { key: 'C', nome: 'MetalMax', produto: 'Aço zincado M8x40', preco: 70, frete: 20, prazo: 1, qualidade: 'Errada' },
    ],
    best: 'B',
    reason: 'FixNaval entrega inox correto, frete grátis e 1 dia. MetalMax é mais barato, mas o material está errado (aço zincado ≠ inox).',
  },
]

export const cotacaoSeed = [
  { produto: 'Parafuso inox M8x40', spec: 'Sextavado A2', qtd: 100, f1: 'Parafusos BR', p1: 0.95, f2: 'FixNaval', p2: 1.1 },
  { produto: 'Arruela inox M8', spec: 'Lisa A2', qtd: 100, f1: 'Parafusos BR', p1: 0.18, f2: 'MetalMax', p2: 0.15 },
  { produto: 'Porca inox M8', spec: 'Sextavada A2', qtd: 100, f1: 'FixNaval', p1: 0.35, f2: 'Parafusos BR', p2: 0.32 },
  { produto: 'Luva nitrílica G', spec: 'Sem pó', qtd: 50, f1: 'EPI Total', p1: 8.0, f2: 'SeguraMais', p2: 7.2 },
  { produto: 'Óculos de proteção', spec: 'Incolor', qtd: 10, f1: 'EPI Total', p1: 12.5, f2: 'SeguraMais', p2: 14.0 },
  { produto: 'Mangueira hidráulica 1/2"', spec: 'SAE 100 R1', qtd: 20, f1: 'HidroMar', p1: 34.0, f2: 'TuboSul', p2: 31.0 },
  { produto: 'Abraçadeira 1/2"', spec: 'Inox', qtd: 20, f1: 'HidroMar', p1: 2.5, f2: 'FixNaval', p2: 2.8 },
  { produto: 'Disco de corte 4.1/2"', spec: 'Inox', qtd: 25, f1: 'Ferramentas Pro', p1: 4.2, f2: 'CorteSul', p2: 3.9 },
  { produto: 'Disco de desbaste', spec: '4.1/2"', qtd: 15, f1: 'Ferramentas Pro', p1: 5.5, f2: 'CorteSul', p2: 5.8 },
  { produto: 'Cabo 2,5 mm²', spec: 'Flexível 100m', qtd: 1, f1: 'EletroMar', p1: 280, f2: 'Fios & Cia', p2: 265 },
  { produto: 'Fita isolante', spec: '19 mm', qtd: 20, f1: 'EletroMar', p1: 3.5, f2: 'Fios & Cia', p2: 3.2 },
  { produto: 'Disjuntor 20A', spec: 'Bipolar', qtd: 5, f1: 'EletroMar', p1: 45, f2: 'Fios & Cia', p2: 48 },
  { produto: 'Chave combinada 13 mm', spec: 'CR-V', qtd: 4, f1: 'Ferramentas Pro', p1: 22, f2: 'ToolNaval', p2: 19.5 },
  { produto: 'Chave Allen jogo', spec: '1,5–10 mm', qtd: 2, f1: 'ToolNaval', p1: 35, f2: 'Ferramentas Pro', p2: 38 },
  { produto: 'Lubrificante spray', spec: '300 ml', qtd: 12, f1: 'CorteSul', p1: 18, f2: 'MetalMax', p2: 16.5 },
  { produto: 'Selante PU', spec: 'Cinza 400g', qtd: 8, f1: 'MetalMax', p1: 28, f2: 'CorteSul', p2: 26 },
  { produto: 'Capacete segurança', spec: 'Com jugular', qtd: 6, f1: 'EPI Total', p1: 32, f2: 'SeguraMais', p2: 29 },
  { produto: 'Protetor auricular', spec: 'Plug', qtd: 30, f1: 'SeguraMais', p1: 2.8, f2: 'EPI Total', p2: 3.1 },
  { produto: 'Terminal olhal M6', spec: 'Cobre', qtd: 50, f1: 'EletroMar', p1: 0.9, f2: 'Fios & Cia', p2: 0.85 },
  { produto: 'Registro esfera 1/2"', spec: 'Latão', qtd: 4, f1: 'HidroMar', p1: 24, f2: 'TuboSul', p2: 22.5 },
]

export const fluxo = [
  'Pedido / solicitação',
  'Entender especificação',
  'Pesquisar fornecedores',
  'Comparar cotações',
  'Emitir pedido de compra',
  'Acompanhar fornecedor',
  'Transporte / frete',
  'Recebimento',
  'Conferência',
  'Estoque / entrega ao uso',
]
