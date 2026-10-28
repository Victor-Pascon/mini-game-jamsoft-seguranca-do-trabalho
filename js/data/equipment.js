/**
 * Catálogo de equipamentos e itens de proteção conquistados no jogo.
 * A ordem da lista é a ordem exibida na barra de EPIs (da cabeça aos pés,
 * terminando nos itens do posto de trabalho).
 *
 * Cada item é desenhado proceduralmente no sprite do jogador por
 * EquipmentRenderer.js — não há imagens externas.
 */
export const equipmentList = [
  {
    id: 'capacete',
    name: 'Capacete de Proteção',
    short: 'CAP',
    norm: 'NR-6',
    normTitle: 'Equipamento de Proteção Individual',
    color: '#ffc107',
    accent: '#ffe082',
    icon: 'helmet',
    description: 'Protege a cabeça contra impactos, quedas de objetos e choques.',
    rule: 'A NR-6 exige EPI adequado ao risco, fornecido gratuitamente pelo empregador, com treinamento e conservação.'
  },
  {
    id: 'oculos',
    name: 'Óculos de Proteção',
    short: 'OCU',
    norm: 'NR-12',
    normTitle: 'Segurança em Máquinas e Equipamentos',
    color: '#4dd0e1',
    accent: '#b2ebf2',
    icon: 'goggles',
    description: 'Protege os olhos contra partículas, cavacos e respingos.',
    rule: 'Na operação de máquinas, a NR-12 exige proteções e dispositivos de segurança; a proteção dos olhos completa o controle do risco.'
  },
  {
    id: 'protetor',
    name: 'Protetor Auricular',
    short: 'AUR',
    norm: 'NR-15',
    normTitle: 'Atividades e Operações Insalubres',
    color: '#ff7043',
    accent: '#ffab91',
    icon: 'earmuffs',
    description: 'Reduz a exposição ao ruído em áreas acima do limite de tolerância.',
    rule: 'A NR-15 estabelece 85 dB(A) para 8 horas de exposição contínua. Medidas coletivas vêm primeiro; o protetor é complementar.'
  },
  {
    id: 'mascara',
    name: 'Máscara de Fuga',
    short: 'MAS',
    norm: 'NR-23',
    normTitle: 'Proteção contra Incêndios',
    color: '#eceff1',
    accent: '#90a4ae',
    icon: 'mask',
    description: 'Ajuda a proteger as vias respiratórias durante a evacuação.',
    rule: 'A NR-23 exige rotas de fuga livres, sinalização, alarme e plano de emergência. A máscara de fuga só deve ser usada conforme o plano.'
  },
  {
    id: 'luvas',
    name: 'Luvas Isolantes',
    short: 'LUV',
    norm: 'NR-10',
    normTitle: 'Segurança em Instalações e Serviços em Eletricidade',
    color: '#3949ab',
    accent: '#9fa8da',
    icon: 'gloves',
    description: 'Protegem as mãos em atividades com risco elétrico.',
    rule: 'A NR-10 exige desenergização, bloqueio, sinalização e EPI específico. Trabalho elétrico é só para profissional qualificado e autorizado.'
  },
  {
    id: 'colete',
    name: 'Colete Refletivo',
    short: 'COL',
    norm: 'NR-26',
    normTitle: 'Sinalização de Segurança',
    color: '#ff8f00',
    accent: '#ffe082',
    icon: 'vest',
    description: 'Aumenta a visibilidade do trabalhador em áreas de circulação.',
    rule: 'A NR-26 padroniza cores e sinais. O colete de alta visibilidade reforça a sinalização e reduz o risco de atropelamento interno.'
  },
  {
    id: 'cinto',
    name: 'Cinto de Segurança',
    short: 'CIN',
    norm: 'NR-35',
    normTitle: 'Trabalho em Altura',
    color: '#455a64',
    accent: '#b0bec5',
    icon: 'harness',
    description: 'Sistema de proteção contra quedas para trabalho acima de 2 metros.',
    rule: 'A NR-35 exige análise de risco, permissão de trabalho, capacitação, ancoragem segura e plano de resgate. Trabalho em altura não é sozinho.'
  },
  {
    id: 'botas',
    name: 'Calçado de Segurança',
    short: 'BOT',
    norm: 'NR-11',
    normTitle: 'Transporte e Movimentação de Materiais',
    color: '#6d4c41',
    accent: '#bcaaa4',
    icon: 'boots',
    description: 'Protege os pés em operações de movimentação de cargas.',
    rule: 'A NR-11 exige operador capacitado, inspeção dos equipamentos, respeito ao limite de carga e rotas sinalizadas.'
  },
  {
    id: 'prancheta',
    name: 'Prancheta do PGR',
    short: 'PGR',
    norm: 'NR-1',
    normTitle: 'Gerenciamento de Riscos Ocupacionais',
    color: '#1565c0',
    accent: '#90caf9',
    icon: 'clipboard',
    description: 'Registra perigos, riscos e medidas de prevenção do PGR.',
    rule: 'A NR-1 manda identificar perigos, avaliar riscos e aplicar a hierarquia de controles. O PGR é um processo vivo, revisado com participação.'
  },
  {
    id: 'cadeira',
    name: 'Cadeira Ergonômica',
    short: 'ERG',
    norm: 'NR-17',
    normTitle: 'Ergonomia',
    color: '#2e7d32',
    accent: '#a5d6a7',
    icon: 'chair',
    description: 'Melhora a postura e o conforto no posto de trabalho.',
    rule: 'A NR-17 pede mobiliário adequado, postura neutra, pausas e avaliação ergonômica. A cadeira ajustável é parte da solução, não o todo.'
  }
];

export const EQUIPMENT_BY_ID = Object.fromEntries(
  equipmentList.map((item) => [item.id, item])
);

export const TOTAL_EQUIPMENT = equipmentList.length;

export function getEquipment(id) {
  return EQUIPMENT_BY_ID[id] || null;
}

export function getEquipmentByNorm(norm) {
  return equipmentList.find((item) => item.norm === norm) || null;
}
