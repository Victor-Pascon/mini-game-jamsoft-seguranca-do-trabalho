export const dialogs = {
  intro: [
    'Bem-vindo à JAMSOFT TECNOLOGIA!',
    'Hoje é o Dia da Segurança do Trabalho e a empresa preparou uma jornada para você.',
    'Sua missão: conversar com os especialistas, aprender as NRs e equipar o colaborador.',
    'Cada resposta correta adiciona um EPI ao personagem: capacete, óculos, luvas, cadeira ergonômica e mais.',
    'Consulte o Manual de NRs com a tecla M e abra o Inventário com I.',
    'Use WASD ou as setas para se mover e ESPAÇO para interagir.',
    'Ao conquistar os 10 itens, você recebe o certificado de Guardião da Segurança do Trabalho.'
  ],

  introSpeaker: {
    name: 'Equipe SESMT',
    role: 'Segurança e Saúde no Trabalho',
    color: '#ff6f00',
    avatar: 'SESMT'
  },

  helpTitle: 'COMO JOGAR',
  helpSteps: [
    'Explore a sede da JAMSOFT com WASD ou as setas.',
    'Aproxime-se de um especialista e pressione ESPAÇO para conversar.',
    'Leia a explicação da NR e responda ao desafio de múltipla escolha.',
    'Cada acerto equipa um novo item de proteção no sprite do jogador.',
    'Use M para o Manual de NRs e I para o inventário.',
    'Conquiste os 10 itens para receber o certificado da feira.'
  ],
  helpControls: [
    'WASD / setas: mover',
    'ESPAÇO / ENTER: interagir e confirmar',
    '1 a 4: escolher resposta',
    'M: Manual de NRs',
    'I: inventário e decoração',
    'F: tela cheia',
    'V: ligar/desligar som',
    'ESC: fechar painéis'
  ],
  helpFooter: 'Conteúdo educativo. Consulte as NRs oficiais e o SESMT da empresa.',

  mural: [
    'Este é o Mural de Normas da JAMSOFT.',
    'Aqui você encontra um resumo das NRs estudadas na jornada.',
    'Use as setas para navegar e ENTER para abrir os detalhes.',
    'Pressione M a qualquer momento para consultar o manual.'
  ],
  muralSpeaker: {
    name: 'Mural de Normas',
    role: 'Consulta rápida das NRs',
    color: '#ec407a',
    avatar: 'NR'
  },

  complete: [
    'Parabéns! Você completou a jornada de Segurança do Trabalho.',
    'Os 10 itens de proteção estão equipados e as NRs foram estudadas.',
    'Agora você é um Guardião da Segurança do Trabalho da JAMSOFT!'
  ],
  completeSpeaker: {
    name: 'Equipe SESMT',
    role: 'Certificação da feira',
    color: '#ffc107',
    avatar: 'OK'
  }
};

export const introLines = dialogs.intro;
export const introSpeaker = dialogs.introSpeaker;
