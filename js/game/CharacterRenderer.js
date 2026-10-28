import { COLORS, shadeColor } from '../design-tokens/snes-theme.js';

/**
 * CharacterRenderer - pixel art procedural dos personagens.
 *
 * O sprite continua ancorado na mesma hitbox do jogo (24x24 para o jogador e
 * 26x26 para os NPCs), mas ganha uma silhueta mais alta, com cabeça, tronco,
 * braços, pernas, sombreamento e animação de caminhada. Tudo é desenhado em
 * retângulos de 1px para preservar a leitura pixel art no canvas 640x480.
 */

export const PLAYER_LOOK = {
  skin: '#f0bd91',
  skinLight: '#ffd7ab',
  skinShade: '#c98b60',
  hair: '#3a2418',
  hairLight: '#5a3824',
  hairShade: '#21130b',
  hairStyle: 'short',
  eye: '#21150f',
  uniform: COLORS.SNES_YELLOW,
  uniformLight: '#ffe082',
  uniformDark: '#b8860b',
  pants: '#22314d',
  pantsLight: '#34496e',
  shoes: '#241a18',
  shoesLight: '#4b3831',
  collar: '#f7f2e7',
  badge: '#ffffff',
  outline: '#111722'
};

const NPC_LOOKS = {
  npc_epi: {
    skin: '#f1c49b',
    skinLight: '#ffdcb2',
    skinShade: '#c78f65',
    hair: '#3b2418',
    hairLight: '#5d3a26',
    hairShade: '#21130c',
    hairStyle: 'bob',
    uniform: '#ff6f00',
    uniformLight: '#ffa040',
    uniformDark: '#a84300',
    pants: '#243447',
    shoes: '#211816',
    earrings: true,
    badge: '#ffffff'
  },
  npc_pgr: {
    skin: '#9b6238',
    skinLight: '#c48b5b',
    skinShade: '#70401f',
    hair: '#1b1210',
    hairLight: '#35221a',
    hairShade: '#0d0705',
    hairStyle: 'curly',
    uniform: '#42a5f5',
    uniformLight: '#82c7ff',
    uniformDark: '#1769aa',
    pants: '#263238',
    shoes: '#161a1c',
    glasses: true,
    badge: '#ffffff'
  },
  npc_brigada: {
    skin: '#d9956b',
    skinLight: '#ffc09a',
    skinShade: '#a96542',
    hair: '#4b1d1d',
    hairLight: '#7a3131',
    hairShade: '#2a0d0d',
    hairStyle: 'ponytail',
    uniform: '#ef5350',
    uniformLight: '#ff8b86',
    uniformDark: '#a72724',
    pants: '#2b3038',
    shoes: '#17191d',
    earrings: true,
    badge: '#ffffff'
  },
  npc_eletrica: {
    skin: '#dfa77d',
    skinLight: '#ffcaa2',
    skinShade: '#ab714c',
    hair: '#241c18',
    hairLight: '#45342a',
    hairShade: '#100b08',
    hairStyle: 'short',
    facialHair: 'beard',
    glasses: true,
    uniform: '#ffd54f',
    uniformLight: '#fff08a',
    uniformDark: '#b29516',
    pants: '#25364b',
    shoes: '#1a1a1a',
    badge: '#ffffff'
  },
  npc_ruido: {
    skin: '#f0c8a0',
    skinLight: '#ffe2bd',
    skinShade: '#c49368',
    hair: '#2a1a12',
    hairLight: '#4b3022',
    hairShade: '#150c08',
    hairStyle: 'long',
    uniform: '#ab47bc',
    uniformLight: '#d982e6',
    uniformDark: '#762785',
    pants: '#263238',
    shoes: '#17191b',
    earrings: true,
    badge: '#ffffff'
  },
  npc_ergonomia: {
    skin: '#a06a43',
    skinLight: '#c99265',
    skinShade: '#73482b',
    hair: '#201612',
    hairLight: '#3d2b23',
    hairShade: '#0f0906',
    hairStyle: 'curly',
    glasses: true,
    uniform: '#66bb6a',
    uniformLight: '#9ee6a1',
    uniformDark: '#328a38',
    pants: '#263238',
    shoes: '#15191b',
    badge: '#ffffff'
  },
  npc_maquinas: {
    skin: '#c6865a',
    skinLight: '#eab088',
    skinShade: '#945a35',
    hair: '#2b1b12',
    hairLight: '#4d3121',
    hairShade: '#160c07',
    hairStyle: 'short',
    uniform: '#ef5350',
    uniformLight: '#ff8f8b',
    uniformDark: '#a92a27',
    pants: '#202b3a',
    shoes: '#181b1d',
    badge: '#ffffff'
  },
  npc_logistica: {
    skin: '#e6b18a',
    skinLight: '#ffd3ad',
    skinShade: '#b87d56',
    hair: '#3a2416',
    hairLight: '#60402a',
    hairShade: '#20120a',
    hairStyle: 'bun',
    uniform: '#a1887f',
    uniformLight: '#d3b9ae',
    uniformDark: '#6d5148',
    pants: '#2d3137',
    shoes: '#191b1d',
    vest: true,
    badge: '#ffffff'
  },
  npc_sinalizacao: {
    skin: '#8d5524',
    skinLight: '#b87a45',
    skinShade: '#633610',
    hair: '#16110e',
    hairLight: '#33261f',
    hairShade: '#080504',
    hairStyle: 'short',
    facialHair: 'beard',
    uniform: '#26a69a',
    uniformLight: '#67ddd1',
    uniformDark: '#08766c',
    pants: '#263238',
    shoes: '#15191b',
    vest: true,
    badge: '#ffffff'
  },
  npc_altura: {
    skin: '#d9a173',
    skinLight: '#ffc99d',
    skinShade: '#a66c42',
    hair: '#6d6d6d',
    hairLight: '#a0a0a0',
    hairShade: '#414141',
    hairStyle: 'short',
    facialHair: 'mustache',
    uniform: '#90a4ae',
    uniformLight: '#c9d7dd',
    uniformDark: '#5b6f79',
    pants: '#263238',
    shoes: '#171a1c',
    vest: true,
    badge: '#ffffff'
  }
};

const SESMT_LOOK = {
  skin: '#a86b43',
  skinLight: '#d09366',
  skinShade: '#78472a',
  hair: '#241811',
  hairLight: '#453025',
  hairShade: '#110a07',
  hairStyle: 'short',
  uniform: '#ff6f00',
  uniformLight: '#ff9d3f',
  uniformDark: '#a84400',
  pants: '#243447',
  shoes: '#181a1c',
  glasses: true,
  badge: '#ffffff',
  headwear: 'helmet',
  headwearColor: '#ffc107'
};

const MURAL_LOOK = {
  skin: '#b97a4f',
  skinLight: '#df9d6c',
  skinShade: '#86522f',
  hair: '#2a1a12',
  hairLight: '#4a3021',
  hairShade: '#140b07',
  hairStyle: 'bob',
  uniform: '#ec407a',
  uniformLight: '#ff82ad',
  uniformDark: '#a5164c',
  pants: '#263238',
  shoes: '#17191b',
  glasses: true,
  badge: '#ffffff'
};

/**
 * Funcionários de cenário. São variações discretas de uniforme, cabelo e tom
 * de pele para que cada sala pareça um setor realmente ocupado, sem competir
 * com os especialistas que conduzem os desafios.
 */
const WORKER_LOOKS = {
  warehouse: {
    skin: '#d99a6c',
    skinLight: '#f5c089',
    skinShade: '#a96a3d',
    hair: '#38251a',
    hairLight: '#5a3a26',
    hairShade: '#1f120a',
    hairStyle: 'short',
    uniform: '#ff8f00',
    pants: '#263238',
    shoes: '#1a1a1a',
    vest: true,
    badge: '#ffffff'
  },
  industrial: {
    skin: '#a86b43',
    skinLight: '#cf9163',
    skinShade: '#78472a',
    hair: '#1f1712',
    hairLight: '#3b2c22',
    hairShade: '#0f0906',
    hairStyle: 'buzz',
    uniform: '#1565c0',
    pants: '#263238',
    shoes: '#151719',
    badge: '#ffffff'
  },
  technical: {
    skin: '#f0c49a',
    skinLight: '#ffdcb2',
    skinShade: '#c58c61',
    hair: '#3a2418',
    hairLight: '#5d3a26',
    hairShade: '#21130c',
    hairStyle: 'bob',
    uniform: '#26a69a',
    pants: '#1c2a31',
    shoes: '#151719',
    badge: '#ffffff'
  },
  fire: {
    skin: '#c6865a',
    skinLight: '#eab088',
    skinShade: '#945a35',
    hair: '#2b1b12',
    hairLight: '#4d3121',
    hairShade: '#160c07',
    hairStyle: 'short',
    uniform: '#b71c1c',
    pants: '#263238',
    shoes: '#151719',
    vest: true,
    badge: '#ffffff'
  },
  office: {
    skin: '#e6b18a',
    skinLight: '#ffd3ad',
    skinShade: '#b87d56',
    hair: '#3a2416',
    hairLight: '#60402a',
    hairShade: '#20120a',
    hairStyle: 'bun',
    uniform: '#90caf9',
    pants: '#263238',
    shoes: '#151719',
    badge: '#ffffff'
  },
  logistics: {
    skin: '#8d5524',
    skinLight: '#b87a45',
    skinShade: '#633610',
    hair: '#16110e',
    hairLight: '#33261f',
    hairShade: '#080504',
    hairStyle: 'short',
    uniform: '#8d6e63',
    pants: '#2d3137',
    shoes: '#151719',
    vest: true,
    badge: '#ffffff'
  }
};

const FALLBACK_LOOKS = [
  NPC_LOOKS.npc_epi,
  NPC_LOOKS.npc_pgr,
  NPC_LOOKS.npc_brigada,
  NPC_LOOKS.npc_eletrica
];

function completeLook(look) {
  const uniform = look.uniform || COLORS.SAFETY_ORANGE;
  return {
    outline: '#10161f',
    eye: '#1a120d',
    collar: '#f6f1e7',
    shoesLight: '#4a3730',
    pantsLight: shadeColor(look.pants || '#263238', 14),
    uniformLight: shadeColor(uniform, 22),
    uniformDark: shadeColor(uniform, -30),
    ...look,
    uniform,
    uniformLight: look.uniformLight || shadeColor(uniform, 22),
    uniformDark: look.uniformDark || shadeColor(uniform, -30)
  };
}

export function getNpcLook(npcOrId) {
  const id = typeof npcOrId === 'string' ? npcOrId : npcOrId?.npcId;
  const look = NPC_LOOKS[id] || FALLBACK_LOOKS[0];
  const color = typeof npcOrId === 'object' ? npcOrId?.color : null;
  return completeLook({ ...look, uniform: color || look.uniform });
}

export function getSpeakerLook(speaker = {}) {
  if (speaker.id && NPC_LOOKS[speaker.id]) {
    return completeLook({ ...NPC_LOOKS[speaker.id], uniform: speaker.color || NPC_LOOKS[speaker.id].uniform });
  }

  const avatar = String(speaker.avatar || '').toUpperCase();
  const name = String(speaker.name || '');

  if (avatar === 'SESMT' || /sesmt|equipe/i.test(name)) {
    return completeLook({ ...SESMT_LOOK, uniform: speaker.color || SESMT_LOOK.uniform });
  }

  if (avatar === 'NR' || /mural/i.test(name)) {
    return completeLook({ ...MURAL_LOOK, uniform: speaker.color || MURAL_LOOK.uniform });
  }

  const index = Math.abs(
    String(speaker.name || speaker.avatar || 'x')
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  ) % FALLBACK_LOOKS.length;

  return completeLook({
    ...FALLBACK_LOOKS[index],
    uniform: speaker.color || FALLBACK_LOOKS[index].uniform
  });
}

function rect(renderer, x, y, width, height, color) {
  renderer.drawRect(
    Math.floor(x),
    Math.floor(y),
    Math.max(1, Math.ceil(width)),
    Math.max(1, Math.ceil(height)),
    color
  );
}

function drawShadow(renderer, x, ground) {
  rect(renderer, x + 3, ground - 1, 18, 2, 'rgba(0, 0, 0, 0.34)');
  rect(renderer, x + 6, ground + 1, 12, 1, 'rgba(0, 0, 0, 0.20)');
}

function drawHair(renderer, x, top, look, direction) {
  const hair = look.hair;
  const light = look.hairLight || shadeColor(hair, 20);
  const dark = look.hairShade || shadeColor(hair, -30);
  const style = look.hairStyle || 'short';

  // Base do cabelo: topo e laterais.
  rect(renderer, x + 5, top + 1, 14, 4, dark);
  rect(renderer, x + 6, top, 12, 3, hair);
  rect(renderer, x + 8, top + 0, 7, 1, light);
  rect(renderer, x + 4, top + 3, 3, 5, hair);
  rect(renderer, x + 17, top + 3, 3, 5, hair);
  rect(renderer, x + 5, top + 2, 3, 1, light);

  if (style === 'bob') {
    rect(renderer, x + 3, top + 4, 3, 8, hair);
    rect(renderer, x + 18, top + 4, 3, 8, hair);
    rect(renderer, x + 7, top + 4, 10, 2, hair);
    rect(renderer, x + 8, top + 5, 5, 1, light);
  } else if (style === 'long') {
    rect(renderer, x + 3, top + 4, 3, 10, hair);
    rect(renderer, x + 18, top + 4, 3, 10, hair);
    rect(renderer, x + 4, top + 11, 2, 3, dark);
    rect(renderer, x + 18, top + 11, 2, 3, dark);
    rect(renderer, x + 7, top + 4, 10, 2, hair);
  } else if (style === 'curly') {
    const curls = [
      [3, 3], [5, 1], [8, 0], [11, 0], [14, 0], [17, 1], [19, 3]
    ];
    for (const [cx, cy] of curls) {
      rect(renderer, x + cx, top + cy, 3, 3, hair);
      rect(renderer, x + cx + 1, top + cy, 1, 1, light);
    }
    rect(renderer, x + 4, top + 5, 3, 5, hair);
    rect(renderer, x + 17, top + 5, 3, 5, hair);
  } else if (style === 'ponytail') {
    rect(renderer, x + 4, top + 4, 2, 7, hair);
    rect(renderer, x + 18, top + 4, 2, 7, hair);
    rect(renderer, x + 19, top + 7, 4, 7, dark);
    rect(renderer, x + 20, top + 7, 2, 5, hair);
    rect(renderer, x + 7, top + 4, 10, 2, hair);
  } else if (style === 'bun') {
    rect(renderer, x + 7, top + 4, 10, 2, hair);
    rect(renderer, x + 17, top - 2, 4, 5, dark);
    rect(renderer, x + 18, top - 2, 3, 3, hair);
    rect(renderer, x + 18, top - 1, 2, 1, light);
  } else if (style === 'buzz') {
    rect(renderer, x + 6, top + 1, 12, 2, hair);
    rect(renderer, x + 5, top + 3, 2, 4, dark);
    rect(renderer, x + 17, top + 3, 2, 4, dark);
  } else {
    // short
    rect(renderer, x + 4, top + 4, 2, 5, hair);
    rect(renderer, x + 18, top + 4, 2, 5, hair);
    rect(renderer, x + 7, top + 4, 10, 2, hair);
    rect(renderer, x + 8, top + 5, 6, 1, light);
  }

  if (direction === 'up') {
    // De costas, o cabelo cobre toda a parte de trás da cabeça.
    rect(renderer, x + 6, top + 3, 12, 7, hair);
    rect(renderer, x + 8, top + 4, 7, 2, light);
    rect(renderer, x + 10, top + 9, 4, 2, dark);
  }

  if (look.headwear === 'helmet') {
    const helmet = look.headwearColor || COLORS.SAFETY_YELLOW;
    const helmetLight = shadeColor(helmet, 28);
    const helmetDark = shadeColor(helmet, -30);
    rect(renderer, x + 5, top - 2, 14, 5, helmetDark);
    rect(renderer, x + 6, top - 3, 12, 4, helmet);
    rect(renderer, x + 8, top - 2, 8, 1, helmetLight);
    rect(renderer, x + 4, top + 2, 16, 2, helmetDark);
    rect(renderer, x + 5, top + 2, 14, 1, helmet);
    rect(renderer, x + 11, top - 3, 2, 4, '#ffffff');
  }
}

function drawHead(renderer, x, top, look, options = {}) {
  const { direction = 'down', blink = false } = options;

  // Pescoço.
  rect(renderer, x + 9, top + 11, 6, 3, look.skinShade);
  rect(renderer, x + 10, top + 11, 4, 2, look.skin);

  // Orelhas (um pouco mais escuras para dar volume).
  rect(renderer, x + 3, top + 6, 3, 5, look.outline);
  rect(renderer, x + 4, top + 7, 2, 3, look.skinShade);
  rect(renderer, x + 18, top + 6, 3, 5, look.outline);
  rect(renderer, x + 18, top + 7, 2, 3, look.skinShade);

  // Silhueta da cabeça.
  rect(renderer, x + 5, top + 2, 14, 11, look.outline);
  rect(renderer, x + 6, top + 3, 12, 9, look.skin);
  rect(renderer, x + 7, top + 11, 10, 2, look.skin);
  rect(renderer, x + 6, top + 4, 2, 7, look.skinLight);
  rect(renderer, x + 17, top + 4, 2, 7, look.skinShade);
  rect(renderer, x + 8, top + 2, 9, 1, look.skinLight);

  drawHair(renderer, x, top, look, direction);

  if (look.earrings) {
    rect(renderer, x + 3, top + 10, 1, 2, COLORS.SAFETY_YELLOW);
    rect(renderer, x + 20, top + 10, 1, 2, COLORS.SAFETY_YELLOW);
  }

  if (direction === 'up') {
    // Nuca e gola; sem rosto.
    rect(renderer, x + 10, top + 12, 4, 2, look.skinShade);
    return;
  }

  const profile = direction === 'left' || direction === 'right';
  const eyeY = top + 6;
  const leftEyeX = direction === 'left' ? x + 8 : x + 8;
  const rightEyeX = x + 14;

  // Sobrancelhas.
  rect(renderer, leftEyeX, eyeY - 2, 3, 1, look.hairShade || look.hair);
  if (!profile) rect(renderer, rightEyeX, eyeY - 2, 3, 1, look.hairShade || look.hair);

  if (blink) {
    rect(renderer, leftEyeX, eyeY + 1, 3, 1, look.eye);
    if (!profile) rect(renderer, rightEyeX, eyeY + 1, 3, 1, look.eye);
  } else {
    rect(renderer, leftEyeX, eyeY, 3, 3, '#ffffff');
    rect(renderer, leftEyeX + 1, eyeY + 1, 1, 2, look.eye);
    rect(renderer, leftEyeX + 1, eyeY + 1, 1, 1, '#ffffff');
    if (!profile) {
      rect(renderer, rightEyeX, eyeY, 3, 3, '#ffffff');
      rect(renderer, rightEyeX + 1, eyeY + 1, 1, 2, look.eye);
      rect(renderer, rightEyeX + 1, eyeY + 1, 1, 1, '#ffffff');
    }
  }

  // Nariz e boca.
  if (direction === 'left') {
    rect(renderer, x + 5, top + 8, 2, 2, look.skinShade);
    rect(renderer, x + 5, top + 8, 1, 1, look.skinLight);
  } else if (direction === 'right') {
    rect(renderer, x + 17, top + 8, 2, 2, look.skinShade);
    rect(renderer, x + 17, top + 8, 1, 1, look.skinLight);
  } else {
    rect(renderer, x + 11, top + 8, 2, 2, look.skinShade);
    rect(renderer, x + 11, top + 8, 1, 1, look.skinLight);
  }

  const mouthX = direction === 'left' ? x + 8 : direction === 'right' ? x + 11 : x + 10;
  rect(renderer, mouthX, top + 10, 4, 1, look.skinShade);
  rect(renderer, mouthX + 1, top + 10, 2, 1, '#7a3d38');
  if (!profile) {
    rect(renderer, mouthX - 1, top + 10, 1, 1, look.skinShade);
    rect(renderer, mouthX + 4, top + 10, 1, 1, look.skinShade);
  }

  if (look.facialHair === 'mustache') {
    rect(renderer, mouthX - 1, top + 9, 6, 1, look.hairShade || look.hair);
  } else if (look.facialHair === 'beard') {
    rect(renderer, x + 8, top + 10, 8, 2, look.hairShade || look.hair);
    rect(renderer, x + 9, top + 12, 6, 1, look.hairShade || look.hair);
    rect(renderer, mouthX, top + 10, 4, 1, '#7a3d38');
  } else if (look.facialHair === 'goatee') {
    rect(renderer, x + 10, top + 11, 4, 2, look.hairShade || look.hair);
  }

  if (look.glasses) {
    rect(renderer, x + 7, top + 6, 4, 1, '#1e2a35');
    rect(renderer, x + 7, top + 7, 1, 3, '#1e2a35');
    rect(renderer, x + 10, top + 7, 1, 3, '#1e2a35');
    rect(renderer, x + 11, top + 7, 2, 1, '#1e2a35');
    if (!profile) {
      rect(renderer, x + 13, top + 6, 4, 1, '#1e2a35');
      rect(renderer, x + 13, top + 7, 1, 3, '#1e2a35');
      rect(renderer, x + 16, top + 7, 1, 3, '#1e2a35');
    }
    rect(renderer, x + 8, top + 7, 1, 1, 'rgba(255, 255, 255, 0.55)');
    if (!profile) rect(renderer, x + 14, top + 7, 1, 1, 'rgba(255, 255, 255, 0.55)');
  }
}

function drawTorso(renderer, x, top, look, options = {}) {
  const { moving = false, phase = 0, direction = 'down' } = options;

  // Pernas e sapatos (desenhados atrás do tronco).
  const leftLift = moving ? Math.max(0, -phase) * 2 : 0;
  const rightLift = moving ? Math.max(0, phase) * 2 : 0;

  rect(renderer, x + 5, top + 21 - leftLift, 6, 8, look.outline);
  rect(renderer, x + 6, top + 21 - leftLift, 4, 6, look.pants);
  rect(renderer, x + 6, top + 21 - leftLift, 2, 4, look.pantsLight || shadeColor(look.pants, 14));
  rect(renderer, x + 5, top + 27 - leftLift, 7, 3, look.shoes);
  rect(renderer, x + 6, top + 27 - leftLift, 4, 1, look.shoesLight || shadeColor(look.shoes, 25));

  rect(renderer, x + 13, top + 21 - rightLift, 6, 8, look.outline);
  rect(renderer, x + 14, top + 21 - rightLift, 4, 6, look.pants);
  rect(renderer, x + 16, top + 21 - rightLift, 2, 4, shadeColor(look.pants, -18));
  rect(renderer, x + 13, top + 27 - rightLift, 7, 3, look.shoes);
  rect(renderer, x + 14, top + 27 - rightLift, 4, 1, look.shoesLight || shadeColor(look.shoes, 25));

  // Braço de trás.
  rect(renderer, x + 2, top + 14, 4, 8, look.outline);
  rect(renderer, x + 3, top + 14, 3, 7, look.uniformDark);
  rect(renderer, x + 3, top + 20, 3, 3, look.skinShade);

  // Tronco com gola, zíper e cinto.
  rect(renderer, x + 4, top + 12, 16, 11, look.outline);
  rect(renderer, x + 5, top + 13, 14, 9, look.uniform);
  rect(renderer, x + 5, top + 13, 2, 8, look.uniformLight);
  rect(renderer, x + 17, top + 13, 2, 8, look.uniformDark);
  rect(renderer, x + 9, top + 13, 6, 2, look.collar || '#f6f1e7');
  rect(renderer, x + 11, top + 15, 2, 5, look.uniformDark);
  rect(renderer, x + 11, top + 16, 1, 2, look.uniformLight);
  rect(renderer, x + 5, top + 20, 14, 2, look.outline);
  rect(renderer, x + 6, top + 20, 12, 1, shadeColor(look.pants || '#263238', 12));
  rect(renderer, x + 11, top + 20, 3, 1, COLORS.SAFETY_YELLOW);
  rect(renderer, x + 12, top + 20, 1, 1, '#ffffff');

  if (direction === 'up') {
    // Costas do uniforme, com costura central.
    rect(renderer, x + 11, top + 13, 2, 7, look.uniformDark);
    rect(renderer, x + 6, top + 15, 4, 2, look.uniformLight);
  } else {
    // Crachá / lanyard.
    rect(renderer, x + 14, top + 15, 4, 4, look.badge || '#ffffff');
    rect(renderer, x + 15, top + 16, 2, 1, COLORS.SAFETY_ORANGE);
    rect(renderer, x + 15, top + 17, 2, 1, look.uniformDark);
  }

  if (look.vest) {
    // Colete refletivo dos personagens que trabalham em campo.
    rect(renderer, x + 5, top + 14, 14, 7, 'rgba(255, 193, 7, 0.28)');
    rect(renderer, x + 6, top + 15, 12, 1, '#f5f5f5');
    rect(renderer, x + 6, top + 18, 12, 1, '#f5f5f5');
  }

  // Braço da frente, com balanço oposto ao passo.
  const armLift = moving ? Math.max(0, phase) * 2 : 0;
  rect(renderer, x + 18, top + 14 - armLift, 4, 8, look.outline);
  rect(renderer, x + 18, top + 14 - armLift, 3, 7, look.uniform);
  rect(renderer, x + 18, top + 14 - armLift, 1, 4, look.uniformLight);
  rect(renderer, x + 18, top + 20 - armLift, 3, 3, look.skin);
  rect(renderer, x + 19, top + 22 - armLift, 2, 1, look.skinLight || shadeColor(look.skin, 18));
}

function drawHumanoid(renderer, x, top, look, options = {}) {
  const { moving = false, frame = 0, time = 0, blink = false, direction = 'down' } = options;
  const phase = moving ? Math.sin((frame / 4) * Math.PI * 2) : 0;
  const bob = moving ? (Math.abs(phase) > 0.45 ? -1 : 0) : 0;
  const breath = !moving && Math.sin(time * 2.1) > 0.55 ? -1 : 0;
  const headBob = bob + breath;

  drawShadow(renderer, x, top + 30);
  drawTorso(renderer, x, top + bob, look, { moving, phase, direction });
  drawHead(renderer, x, top + headBob, look, { direction, blink });

  // Poeira sutil nos passos.
  if (moving && Math.abs(phase) < 0.2) {
    rect(renderer, x + 1, top + 29, 2, 1, 'rgba(255, 255, 255, 0.12)');
    rect(renderer, x + 20, top + 29, 2, 1, 'rgba(255, 255, 255, 0.10)');
  }
}

export function drawPlayerSprite(renderer, x, y, options = {}) {
  const {
    direction = 'down',
    moving = false,
    frame = 0,
    time = 0,
    look = PLAYER_LOOK
  } = options;

  const top = Math.floor(y) - 6;
  const blink = !moving && (time % 4.2) > 4.05;
  drawHumanoid(renderer, Math.floor(x), top, completeLook(look), {
    direction,
    moving,
    frame,
    time,
    blink
  });
}

export function getWorkerLook(worker = {}) {
  const base = WORKER_LOOKS[worker.look] || WORKER_LOOKS.industrial;
  return completeLook({
    ...base,
    uniform: worker.uniform || base.uniform
  });
}

/**
 * Sprite de funcionário em atividade. Usa a mesma base do jogador/NPC para
 * manter a linguagem visual, mas com um pequeno atraso de respiração por
 * posição para que os trabalhadores não pisquem em sincronia.
 */
export function drawWorkerSprite(renderer, worker, options = {}) {
  if (!worker) return getWorkerLook();

  const x = Math.floor(worker.x);
  const top = Math.floor(worker.y) - 6;
  const look = getWorkerLook(worker);
  const offset = Math.abs(worker.x * 0.031 + worker.y * 0.017);
  const time = (options.time || 0) + offset;
  const blink = (time % 5.3) > 5.12;

  drawHumanoid(renderer, x, top, look, {
    direction: worker.direction || 'down',
    moving: false,
    frame: 0,
    time,
    blink
  });

  return look;
}

/**
 * Camada cosmética opcional, desenhada depois dos EPIs para continuar visível.
 */
export function drawPlayerDecoration(renderer, player, decoration, bounce = 0) {
  if (!player || !decoration) return;

  const x = Math.floor(player.x);
  const top = Math.floor(player.y) + bounce - 6;

  if (decoration === 'pin_jamsoft') {
    rect(renderer, x + 7, top + 14, 3, 4, '#8f0f18');
    rect(renderer, x + 8, top + 15, 2, 2, '#d71920');
    rect(renderer, x + 8, top + 15, 1, 1, '#ffffff');
    return;
  }

  if (decoration === 'adesivo_capacete') {
    const hasHelmet = player.hasEquipment && player.hasEquipment('capacete');
    if (!hasHelmet) return;
    rect(renderer, x + 14, top, 5, 3, '#ffffff');
    rect(renderer, x + 15, top + 1, 3, 1, '#d71920');
    rect(renderer, x + 19, top + 1, 1, 2, '#d71920');
    return;
  }

  if (decoration === 'faixa_guardiao') {
    rect(renderer, x + 17, top + 13, 3, 10, '#8f0f18');
    rect(renderer, x + 18, top + 13, 1, 8, '#ff3b4a');
    rect(renderer, x + 17, top + 17, 3, 1, '#ffffff');
  }
}

export function drawNpcSprite(renderer, npc, options = {}) {
  const x = Math.floor(npc.x) + 1;
  const top = Math.floor(npc.y) - 4;
  const look = getNpcLook(npc);
  const time = options.time || 0;
  const direction = options.direction || 'down';
  const blink = (time % 4.7) > 4.54;

  drawHumanoid(renderer, x, top, look, {
    direction,
    moving: false,
    frame: 0,
    time,
    blink
  });

  return look;
}
