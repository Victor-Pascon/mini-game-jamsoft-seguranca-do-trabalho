import { getRoomCenter } from './maps.js';

function npcPosition(roomId) {
  const center = getRoomCenter(roomId);
  if (!center) return { x: 0, y: 0 };
  // NPC tem 26x26; posiciona o centro do NPC no centro da sala.
  return { x: center.x - 13, y: center.y - 13 };
}

/**
 * Especialistas da JAMSOFT TECNOLOGIA.
 * Cada NPC apresenta uma NR, propõe um desafio e entrega um item de proteção.
 */
export const npcs = [
  {
    id: 'npc_epi',
    name: 'Helena Proteção',
    role: 'Técnica de Segurança do Trabalho',
    color: '#ff6f00',
    avatar: 'HP',
    roomId: 'epi',
    norm: 'NR-6',
    equipmentId: 'capacete',
    ...npcPosition('epi'),
    interactRadius: 54,
    dialogIntro: [
      'Olá! Sou Helena, técnica de segurança do trabalho da JAMSOFT.',
      'Antes de entrar na área, todo colaborador precisa conhecer os riscos e usar o EPI correto.',
      'A NR-6 diz que o empregador fornece o EPI gratuitamente, com treinamento e em bom estado.',
      'O capacete protege a cabeça contra impactos e objetos que caem.',
      'Vamos ver se você sabe quem é responsável pelo fornecimento do EPI?'
    ],
    dialogRepeat: [
      'Seu capacete está firme! A NR-6 continua valendo em cada turno.',
      'Use o EPI só para a finalidade dele e substitua se estiver danificado.'
    ],
    dialogHint: [
      'Dica: a NR-6 distribui obrigações entre empregador e trabalhador.',
      'Quem fornece o EPI não é o trabalhador nem o sindicato.'
    ]
  },
  {
    id: 'npc_pgr',
    name: 'Lúcia Riscos',
    role: 'Coordenadora do PGR',
    color: '#42a5f5',
    avatar: 'LR',
    roomId: 'pgr',
    norm: 'NR-1',
    equipmentId: 'prancheta',
    ...npcPosition('pgr'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Lúcia, coordenadora do PGR na JAMSOFT.',
      'A NR-1 organiza o gerenciamento de riscos ocupacionais: identificar, avaliar e controlar.',
      'O PGR não é papel de gaveta: ele é revisado e construído com quem faz o trabalho.',
      'Antes de pensar em EPI, precisamos eliminar ou reduzir o risco na fonte.',
      'O que vem primeiro no PGR?'
    ],
    dialogRepeat: [
      'Sua prancheta do PGR está pronta. Continue registrando perigos e medidas.',
      'Lembre: a hierarquia de controles começa antes do EPI.'
    ],
    dialogHint: [
      'Dica: o PGR começa pelo inventário de riscos.',
      'Identificar perigos e avaliar riscos vem antes de escolher a proteção.'
    ]
  },
  {
    id: 'npc_brigada',
    name: 'Ana Fogo',
    role: 'Brigadista de Incêndio',
    color: '#ef5350',
    avatar: 'AF',
    roomId: 'brigada',
    norm: 'NR-23',
    equipmentId: 'mascara',
    ...npcPosition('brigada'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Ana, brigadista de incêndio da JAMSOFT.',
      'A NR-23 trata de prevenção e combate a incêndios.',
      'Extintores sinalizados, saídas livres, alarme e treinamento salvam vidas.',
      'Em uma evacuação, siga o plano e use a máscara de fuga apenas se ela estiver prevista.',
      'O que precisa estar sempre desobstruído?'
    ],
    dialogRepeat: [
      'Sua máscara de fuga está pronta. Mas a rota de saída precisa estar livre!',
      'A NR-23 também exige brigada e plano de emergência.'
    ],
    dialogHint: [
      'Dica: em incêndio, a saída de emergência é prioridade.',
      'Nada de bloquear corredores e portas de fuga.'
    ]
  },
  {
    id: 'npc_eletrica',
    name: 'Rafael Volts',
    role: 'Engenheiro Eletricista',
    color: '#ffd54f',
    avatar: 'RV',
    roomId: 'eletrica',
    norm: 'NR-10',
    equipmentId: 'luvas',
    ...npcPosition('eletrica'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Rafael, engenheiro eletricista responsável pela oficina.',
      'A NR-10 é clara: só profissional qualificado e autorizado intervém em instalações elétricas.',
      'Antes de qualquer manutenção, desenergize, bloqueie e sinalize.',
      'As luvas isolantes fazem parte do conjunto de proteção, não são um passe livre.',
      'Qual é o procedimento antes de mexer no circuito?'
    ],
    dialogRepeat: [
      'Luvas isolantes em dia! Mas lembre: desenergizar e bloquear vem primeiro.',
      'A NR-10 exige procedimento, prontuário e treinamento.'
    ],
    dialogHint: [
      'Dica: não se trabalha em circuito energizado por conveniência.',
      'Desenergizar, bloquear e sinalizar é o caminho.'
    ]
  },
  {
    id: 'npc_ruido',
    name: 'Sofia Ruído',
    role: 'Técnica de Higiene Ocupacional',
    color: '#ab47bc',
    avatar: 'SR',
    roomId: 'ruido',
    norm: 'NR-15',
    equipmentId: 'protetor',
    ...npcPosition('ruido'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Sofia, da higiene ocupacional. Este setor passa fácil dos limites de ruído.',
      'A NR-15 estabelece 85 dB(A) para oito horas de exposição contínua.',
      'Primeiro tentamos controlar o ruído na fonte; depois, a proteção individual.',
      'O protetor auricular precisa ser colocado corretamente e mantido limpo.',
      'Qual é o limite de tolerância para 8 horas?'
    ],
    dialogRepeat: [
      'Seu protetor está com você. Evite ficar sem ele nesta área.',
      'A NR-15 também pede avaliação por profissional habilitado.'
    ],
    dialogHint: [
      'Dica: o limite clássico da NR-15 para ruído contínuo é 85 dB(A).',
      'Não é 65, 75 ou 105 dB(A).'
    ]
  },
  {
    id: 'npc_ergonomia',
    name: 'Davi Postura',
    role: 'Analista de Ergonomia',
    color: '#66bb6a',
    avatar: 'DP',
    roomId: 'ergonomia',
    norm: 'NR-17',
    equipmentId: 'cadeira',
    ...npcPosition('ergonomia'),
    interactRadius: 54,
    dialogIntro: [
      'Oi! Sou Davi, analista de ergonomia.',
      'A NR-17 adapta o trabalho às pessoas: mobiliário, postura, pausas e iluminação.',
      'Uma cadeira ajustável ajuda, mas não resolve tudo sozinha.',
      'O monitor na altura dos olhos e pausas regulares também fazem parte.',
      'O que é uma boa medida ergonômica?'
    ],
    dialogRepeat: [
      'Sua cadeira ergonômica está no posto. Ajuste a altura e faça pausas!',
      'A NR-17 também olha para organização do trabalho e riscos psicossociais.'
    ],
    dialogHint: [
      'Dica: ergonomia é conforto, postura e pausas — não só estética.',
      'Cadeira ajustável e pausas são medidas da NR-17.'
    ]
  },
  {
    id: 'npc_maquinas',
    name: 'Caio Produção',
    role: 'Técnico de Máquinas',
    color: '#ef5350',
    avatar: 'CP',
    roomId: 'maquinas',
    norm: 'NR-12',
    equipmentId: 'oculos',
    ...npcPosition('maquinas'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Caio, técnico de produção. Aqui a máquina não anda sem proteção.',
      'A NR-12 exige proteções fixas, móveis e dispositivos de segurança.',
      'O botão de emergência precisa estar acessível, e a manutenção começa com bloqueio e etiquetagem.',
      'Os óculos de proteção completam o controle contra partículas.',
      'O que fazemos com as proteções da máquina?'
    ],
    dialogRepeat: [
      'Óculos no lugar! E as proteções da máquina continuam intocadas.',
      'A NR-12 não permite remover proteção para ganhar velocidade.'
    ],
    dialogHint: [
      'Dica: produtividade nunca justifica remover uma proteção.',
      'Proteções e dispositivos de segurança são obrigatórios.'
    ]
  },
  {
    id: 'npc_logistica',
    name: 'Bruna Logística',
    role: 'Operadora de Empilhadeira',
    color: '#a1887f',
    avatar: 'BL',
    roomId: 'logistica',
    norm: 'NR-11',
    equipmentId: 'botas',
    ...npcPosition('logistica'),
    interactRadius: 54,
    dialogIntro: [
      'Oi! Sou Bruna, da logística. Opero empilhadeira há anos.',
      'A NR-11 exige capacitação e autorização para operar equipamentos de movimentação.',
      'Também precisamos inspecionar a máquina, respeitar a carga e sinalizar as rotas.',
      'O calçado de segurança protege os pés durante o manuseio de materiais.',
      'Quem pode operar a empilhadeira?'
    ],
    dialogRepeat: [
      'Suas botas estão no lugar. A NR-11 também cobra inspeção e respeito à carga.',
      'Não transporte pessoas na empilhadeira, combinado?'
    ],
    dialogHint: [
      'Dica: capacitação e autorização andam juntas na NR-11.',
      'Não basta saber dirigir: é preciso ser autorizado.'
    ]
  },
  {
    id: 'npc_sinalizacao',
    name: 'Igor Visibilidade',
    role: 'Técnico de Sinalização',
    color: '#26a69a',
    avatar: 'IV',
    roomId: 'sinalizacao',
    norm: 'NR-26',
    equipmentId: 'colete',
    ...npcPosition('sinalizacao'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Igor, responsável pela sinalização de segurança.',
      'A NR-26 padroniza cores e sinais para que todo mundo entenda o risco.',
      'Vermelho é combate a incêndio; amarelo é advertência; azul é obrigação; verde é segurança.',
      'O colete refletivo aumenta sua visibilidade em áreas de circulação.',
      'O que a cor amarela indica?'
    ],
    dialogRepeat: [
      'Colete refletivo em uso! A sinalização também precisa estar visível.',
      'A NR-26 não é decoração: é comunicação de risco.'
    ],
    dialogHint: [
      'Dica: amarelo pede atenção e advertência.',
      'Azul é obrigação; verde é segurança.'
    ]
  },
  {
    id: 'npc_altura',
    name: 'Marcos Altura',
    role: 'Instrutor de Trabalho em Altura',
    color: '#90a4ae',
    avatar: 'MA',
    roomId: 'altura',
    norm: 'NR-35',
    equipmentId: 'cinto',
    ...npcPosition('altura'),
    interactRadius: 54,
    dialogIntro: [
      'Sou Marcos, instrutor de trabalho em altura.',
      'A NR-35 vale para atividades acima de 2 metros.',
      'Antes de subir: análise de risco, permissão de trabalho e capacitação.',
      'O cinto paraquedista precisa de ponto de ancoragem seguro e plano de resgate.',
      'Trabalho em altura não se faz sozinho! A partir de qual altura a NR-35 se aplica?'
    ],
    dialogRepeat: [
      'Cinto e ancoragem conferidos? A NR-35 continua valendo em cada subida.',
      'Plano de resgate e trabalho em equipe são obrigatórios.'
    ],
    dialogHint: [
      'Dica: a referência é acima de 2 metros.',
      'Não é 1 metro, 1,5 metro ou 5 metros.'
    ]
  }
];

export const NPC_BY_ID = Object.fromEntries(npcs.map((npc) => [npc.id, npc]));

export function getNpc(id) {
  return NPC_BY_ID[id] || null;
}
