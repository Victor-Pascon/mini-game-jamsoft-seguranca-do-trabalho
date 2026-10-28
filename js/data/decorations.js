/**
 * Itens decorativos do inventário.
 *
 * São cosméticos opcionais: não alteram a proteção do personagem nem o
 * conteúdo educativo. A disponibilidade acompanha o progresso da jornada.
 */
export const decorativeItems = [
  {
    id: 'pin_jamsoft',
    name: 'Pin JAMSOFT',
    short: 'PIN',
    description: 'Broche vermelho e branco no peito do uniforme.',
    unlockCount: 0,
    unlockEquipment: null
  },
  {
    id: 'adesivo_capacete',
    name: 'Adesivo de Capacete',
    short: 'ADES',
    description: 'Adesivo de segurança aplicado na lateral do capacete.',
    unlockCount: 1,
    unlockEquipment: 'capacete'
  },
  {
    id: 'faixa_guardiao',
    name: 'Faixa de Guardião',
    short: 'FAIXA',
    description: 'Faixa vermelha conquistada após cinco fases concluídas.',
    unlockCount: 5,
    unlockEquipment: null
  }
];

export const DECORATION_BY_ID = Object.fromEntries(
  decorativeItems.map((item) => [item.id, item])
);

export function getDecoration(id) {
  return DECORATION_BY_ID[id] || null;
}

export function isDecorationUnlocked(item, equipmentSystem = null) {
  if (!item) return false;
  if (item.unlockEquipment && !equipmentSystem?.has(item.unlockEquipment)) {
    return false;
  }
  const count = equipmentSystem?.getCount ? equipmentSystem.getCount() : 0;
  return count >= (item.unlockCount || 0);
}
