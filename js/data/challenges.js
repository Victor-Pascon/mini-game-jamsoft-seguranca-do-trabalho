/**
 * Desafios de Segurança do Trabalho.
 * Cada desafio está ligado a um NPC, uma NR e um item de proteção.
 * A resposta correta é a única condição para conquistar o item.
 */
export const challenges = [
  {
    id: 'challenge_nr1',
    npcId: 'npc_pgr',
    equipmentId: 'prancheta',
    norm: 'NR-1',
    normTitle: 'Gerenciamento de Riscos Ocupacionais',
    roomName: 'Sala do PGR',
    question: 'No PGR da NR-1, o que deve ser feito antes de definir as medidas de prevenção?',
    options: [
      'Comprar o EPI mais barato',
      'Identificar perigos e avaliar riscos',
      'Contratar mais colaboradores',
      'Esperar acontecer um acidente'
    ],
    correct: 1,
    hint: 'O PGR começa pelo inventário de riscos. O EPI é a última barreira da hierarquia de controles.',
    explanation: 'A NR-1 exige identificar perigos, avaliar os riscos e definir medidas de prevenção na hierarquia de controles.'
  },
  {
    id: 'challenge_nr6',
    npcId: 'npc_epi',
    equipmentId: 'capacete',
    norm: 'NR-6',
    normTitle: 'Equipamento de Proteção Individual',
    roomName: 'Almoxarifado de EPI',
    question: 'Quem deve fornecer o EPI adequado ao risco, gratuitamente, segundo a NR-6?',
    options: [
      'O próprio trabalhador',
      'O sindicato',
      'O empregador',
      'A prefeitura'
    ],
    correct: 2,
    hint: 'A NR-6 distribui obrigações: o empregador fornece, treina e exige o uso; o trabalhador usa e conserva.',
    explanation: 'O empregador fornece gratuitamente o EPI adequado ao risco, com CA válido, treinamento e substituição quando necessário.'
  },
  {
    id: 'challenge_nr10',
    npcId: 'npc_eletrica',
    equipmentId: 'luvas',
    norm: 'NR-10',
    normTitle: 'Segurança em Instalações e Serviços em Eletricidade',
    roomName: 'Oficina Elétrica',
    question: 'Qual procedimento é obrigatório antes de intervir em um circuito elétrico, segundo a NR-10?',
    options: [
      'Desenergizar e bloquear a instalação',
      'Trabalhar com as duas mãos',
      'Usar apenas luvas de látex',
      'Aumentar a tensão para testar'
    ],
    correct: 0,
    hint: 'A NR-10 exige desenergização, bloqueio, sinalização e EPI específico. Trabalho elétrico é para profissional autorizado.',
    explanation: 'Antes da manutenção: desenergizar, bloquear, sinalizar e testar a ausência de tensão. As luvas isolantes fazem parte do conjunto.'
  },
  {
    id: 'challenge_nr11',
    npcId: 'npc_logistica',
    equipmentId: 'botas',
    norm: 'NR-11',
    normTitle: 'Transporte e Movimentação de Materiais',
    roomName: 'Logística',
    question: 'Antes de operar uma empilhadeira, o trabalhador deve, conforme a NR-11:',
    options: [
      'Ser capacitado e autorizado',
      'Ter apenas carteira de motorista',
      'Trabalhar sem cinto de segurança',
      'Transportar colegas na garra'
    ],
    correct: 0,
    hint: 'Capacitação e autorização são requisitos da NR-11. Também é preciso inspecionar o equipamento e respeitar a carga.',
    explanation: 'A NR-11 exige operador capacitado e autorizado, inspeção do equipamento, sinalização das rotas e respeito ao limite de carga.'
  },
  {
    id: 'challenge_nr12',
    npcId: 'npc_maquinas',
    equipmentId: 'oculos',
    norm: 'NR-12',
    normTitle: 'Segurança em Máquinas e Equipamentos',
    roomName: 'Produção / Máquinas',
    question: 'Qual é a medida correta de segurança em máquinas, segundo a NR-12?',
    options: [
      'Remover a proteção para produzir mais',
      'Usar proteções e dispositivos de segurança',
      'Desligar o botão de emergência',
      'Operar sem treinamento'
    ],
    correct: 1,
    hint: 'A NR-12 exige proteções fixas, móveis e dispositivos de segurança. Nunca remova uma proteção para ganhar velocidade.',
    explanation: 'Proteções e dispositivos de segurança previnem o acesso a zonas de perigo. O botão de emergência deve ficar acessível e a manutenção começa com bloqueio.'
  },
  {
    id: 'challenge_nr15',
    npcId: 'npc_ruido',
    equipmentId: 'protetor',
    norm: 'NR-15',
    normTitle: 'Atividades e Operações Insalubres',
    roomName: 'Área de Ruído',
    question: 'Qual é o limite de tolerância de ruído contínuo para 8 horas, segundo a NR-15?',
    options: [
      '65 dB(A)',
      '75 dB(A)',
      '85 dB(A)',
      '105 dB(A)'
    ],
    correct: 2,
    hint: 'O limite clássico da NR-15 para ruído contínuo é 85 dB(A) para 8 horas. Acima disso, medidas de controle são necessárias.',
    explanation: 'A NR-15 estabelece 85 dB(A) para 8 horas de exposição contínua. Primeiro controlamos o ruído na fonte; o protetor auricular é complementar.'
  },
  {
    id: 'challenge_nr17',
    npcId: 'npc_ergonomia',
    equipmentId: 'cadeira',
    norm: 'NR-17',
    normTitle: 'Ergonomia',
    roomName: 'Escritório Ergonômico',
    question: 'Qual medida atende à NR-17 no posto de trabalho de escritório?',
    options: [
      'Cadeira ergonômica ajustável e pausas',
      'Trabalhar 10 horas sem pausa',
      'Monitor acima da cabeça',
      'Iluminação insuficiente'
    ],
    correct: 0,
    hint: 'A NR-17 pede mobiliário adequado, postura neutra, pausas e avaliação ergonômica. A cadeira ajuda, mas não resolve tudo.',
    explanation: 'Cadeira ajustável, monitor na altura dos olhos, apoio para os pés e pausas fazem parte de um posto ergonômico. A NR-17 também considera a organização do trabalho.'
  },
  {
    id: 'challenge_nr23',
    npcId: 'npc_brigada',
    equipmentId: 'mascara',
    norm: 'NR-23',
    normTitle: 'Proteção contra Incêndios',
    roomName: 'Brigada de Incêndio',
    question: 'Em caso de incêndio, o que a NR-23 exige que esteja desobstruído e sinalizado?',
    options: [
      'O depósito de materiais',
      'As saídas de emergência',
      'O refeitório',
      'O estacionamento'
    ],
    correct: 1,
    hint: 'A NR-23 exige saídas de emergência e rotas de fuga livres, sinalizadas, com alarme e plano de emergência.',
    explanation: 'Saídas de emergência desobstruídas e sinalizadas são essenciais. A NR-23 também trata de extintores, alarme, brigada e treinamento.'
  },
  {
    id: 'challenge_nr26',
    npcId: 'npc_sinalizacao',
    equipmentId: 'colete',
    norm: 'NR-26',
    normTitle: 'Sinalização de Segurança',
    roomName: 'Sinalização de Segurança',
    question: 'Na sinalização de segurança da NR-26, a cor amarela indica:',
    options: [
      'Obrigação',
      'Advertência',
      'Saída de emergência',
      'Combate a incêndio'
    ],
    correct: 1,
    hint: 'Amarelo é advertência e atenção. Vermelho é combate a incêndio; azul é obrigação; verde é segurança e saída.',
    explanation: 'A NR-26 padroniza as cores: amarelo para advertência, vermelho para combate a incêndio e emergência, azul para obrigação e verde para segurança.'
  },
  {
    id: 'challenge_nr35',
    npcId: 'npc_altura',
    equipmentId: 'cinto',
    norm: 'NR-35',
    normTitle: 'Trabalho em Altura',
    roomName: 'Trabalho em Altura',
    question: 'A partir de qual altura o trabalho é considerado em altura pela NR-35?',
    options: [
      '1 metro',
      '1,5 metro',
      '2 metros',
      '5 metros'
    ],
    correct: 2,
    hint: 'A NR-35 se aplica a atividades acima de 2 metros. Exige análise de risco, permissão, capacitação, cinto e plano de resgate.',
    explanation: 'Trabalho em altura é acima de 2 metros. A NR-35 exige análise de risco, permissão de trabalho, capacitação, ancoragem segura e plano de resgate.'
  }
];

export const CHALLENGE_BY_NPC = Object.fromEntries(
  challenges.map((challenge) => [challenge.npcId, challenge])
);

export const CHALLENGE_BY_EQUIPMENT = Object.fromEntries(
  challenges.map((challenge) => [challenge.equipmentId, challenge])
);

export function getChallengeByNpc(npcId) {
  return CHALLENGE_BY_NPC[npcId] || null;
}
