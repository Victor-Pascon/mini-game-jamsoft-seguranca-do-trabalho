/**
 * Manual de Normas Regulamentadoras (NRs) — conteúdo educativo.
 *
 * IMPORTANTE: este material é um resumo para o jogo e para a feira.
 * A versão oficial e atualizada deve ser consultada no site do Ministério
 * do Trabalho e Emprego e validada pelo SESMT da empresa.
 */
export const OFFICIAL_SOURCE = 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadoras';

export const NORMS_DISCLAIMER = 'Resumo educativo. Consulte a NR oficial vigente e o SESMT da empresa antes de aplicar as regras.';

export const norms = [
  {
    nr: 'NR-1',
    title: 'Disposições Gerais e Gerenciamento de Riscos Ocupacionais',
    short: 'Gerenciamento de riscos',
    color: '#1565c0',
    equipmentId: 'prancheta',
    summary: 'Estabelece as bases do gerenciamento de riscos ocupacionais (GRO) e do PGR.',
    rules: [
      'Identificar perigos e avaliar os riscos de cada atividade.',
      'Aplicar a hierarquia de controles: eliminar, substituir, controlar na fonte, medidas administrativas e, por último, EPI.',
      'Elaborar, implementar e revisar o PGR com participação dos trabalhadores.',
      'Registrar as medidas de prevenção e acompanhar sua eficácia.'
    ]
  },
  {
    nr: 'NR-5',
    title: 'Comissão Interna de Prevenção de Acidentes e de Assédio',
    short: 'CIPA',
    color: '#8e24aa',
    equipmentId: null,
    summary: 'A CIPA atua na prevenção de acidentes, doenças e assédio no ambiente de trabalho.',
    rules: [
      'Dimensionamento conforme o grau de risco e o número de empregados.',
      'Reuniões mensais e participação dos representantes dos trabalhadores.',
      'Treinamento dos membros e divulgação das ações preventivas.',
      'Registro das reuniões e encaminhamento das medidas necessárias.'
    ]
  },
  {
    nr: 'NR-6',
    title: 'Equipamento de Proteção Individual',
    short: 'EPI',
    color: '#ff6f00',
    equipmentId: 'capacete',
    summary: 'Define obrigações sobre fornecimento, uso, guarda e conservação dos EPIs.',
    rules: [
      'O empregador fornece gratuitamente o EPI adequado ao risco, com CA válido.',
      'O trabalhador usa o EPI para a finalidade a que se destina e conserva o equipamento.',
      'O EPI deve ser substituído quando danificado ou extraviado.',
      'O EPI é a última barreira: não substitui medidas de proteção coletiva.'
    ]
  },
  {
    nr: 'NR-7',
    title: 'Programa de Controle Médico de Saúde Ocupacional',
    short: 'PCMSO',
    color: '#00897b',
    equipmentId: null,
    summary: 'Organiza a vigilância da saúde dos trabalhadores por meio do PCMSO.',
    rules: [
      'Exames admissionais, periódicos, de retorno ao trabalho, de mudança de risco e demissionais.',
      'Emitir o ASO e manter os registros atualizados.',
      'O PCMSO deve ter médico coordenador.',
      'Acompanhar a relação entre a saúde e os riscos ocupacionais.'
    ]
  },
  {
    nr: 'NR-10',
    title: 'Segurança em Instalações e Serviços em Eletricidade',
    short: 'Eletricidade',
    color: '#f9a825',
    equipmentId: 'luvas',
    summary: 'Medidas de controle para garantir a segurança em trabalhos com eletricidade.',
    rules: [
      'Somente profissionais qualificados e autorizados podem intervir.',
      'Desenergizar, bloquear e sinalizar antes da manutenção.',
      'Usar EPI e EPC específicos para eletricidade.',
      'Manter prontuário, treinamentos e procedimentos atualizados.'
    ]
  },
  {
    nr: 'NR-11',
    title: 'Transporte, Movimentação, Armazenagem e Manuseio de Materiais',
    short: 'Movimentação de cargas',
    color: '#8d6e63',
    equipmentId: 'botas',
    summary: 'Requisitos para a movimentação segura de cargas e materiais.',
    rules: [
      'Operador de empilhadeira capacitado e autorizado.',
      'Inspecionar os equipamentos e respeitar o limite de carga.',
      'Sinalizar rotas e áreas de circulação.',
      'Não transportar pessoas em equipamentos de carga.'
    ]
  },
  {
    nr: 'NR-12',
    title: 'Segurança no Trabalho em Máquinas e Equipamentos',
    short: 'Máquinas',
    color: '#c62828',
    equipmentId: 'oculos',
    summary: 'Prevenção de acidentes em máquinas e equipamentos.',
    rules: [
      'Instalar proteções fixas e móveis e dispositivos de segurança.',
      'Manter o botão de emergência acessível.',
      'Bloquear e etiquetar a máquina antes da manutenção.',
      'Treinar operadores e proibir a remoção das proteções.'
    ]
  },
  {
    nr: 'NR-15',
    title: 'Atividades e Operações Insalubres',
    short: 'Ruído e agentes nocivos',
    color: '#8e44ad',
    equipmentId: 'protetor',
    summary: 'Limites de tolerância e medidas de controle para agentes nocivos.',
    rules: [
      'Ruído contínuo: limite de 85 dB(A) para jornada de 8 horas.',
      'Adotar medidas coletivas e, quando necessário, proteção individual.',
      'Avaliar os agentes por profissional habilitado.',
      'A exposição pode gerar adicional de insalubridade conforme a norma.'
    ]
  },
  {
    nr: 'NR-17',
    title: 'Ergonomia',
    short: 'Ergonomia',
    color: '#2e7d32',
    equipmentId: 'cadeira',
    summary: 'Adapta as condições de trabalho às características dos trabalhadores.',
    rules: [
      'Mobiliário e posto de trabalho adequados à tarefa e à postura.',
      'Prever pausas e alternância de atividades.',
      'Avaliar levantamento de cargas, alcance, iluminação e conforto.',
      'Considerar os riscos psicossociais e a participação dos trabalhadores.'
    ]
  },
  {
    nr: 'NR-23',
    title: 'Proteção contra Incêndios',
    short: 'Incêndio',
    color: '#e53935',
    equipmentId: 'mascara',
    summary: 'Medidas de prevenção e combate a incêndios.',
    rules: [
      'Extintores adequados, sinalizados e desobstruídos.',
      'Saídas de emergência e rotas de fuga livres.',
      'Alarme, iluminação de emergência e treinamento.',
      'Brigada de incêndio e plano de emergência.'
    ]
  },
  {
    nr: 'NR-26',
    title: 'Sinalização de Segurança',
    short: 'Sinalização',
    color: '#00897b',
    equipmentId: 'colete',
    summary: 'Cores e sinais que identificam riscos e orientam condutas seguras.',
    rules: [
      'Vermelho: combate a incêndio e emergência.',
      'Amarelo: advertência e atenção.',
      'Azul: obrigação; verde: segurança e saída.',
      'Sinalização visível, legível e conservada.'
    ]
  },
  {
    nr: 'NR-35',
    title: 'Trabalho em Altura',
    short: 'Trabalho em altura',
    color: '#455a64',
    equipmentId: 'cinto',
    summary: 'Requisitos para atividades acima de 2 metros de altura.',
    rules: [
      'Análise de risco, permissão de trabalho e capacitação.',
      'Cinto paraquedista, talabarte e ponto de ancoragem adequados.',
      'O trabalho em altura não deve ser realizado sozinho.',
      'Plano de resgate e controle de quedas de materiais.'
    ]
  }
];

export const NORM_BY_NR = Object.fromEntries(norms.map((norm) => [norm.nr, norm]));

export function getNorm(nr) {
  return NORM_BY_NR[nr] || null;
}
