import {
  equipmentList,
  EQUIPMENT_BY_ID,
  TOTAL_EQUIPMENT,
  getEquipment
} from '../data/equipment.js';
import { drawIconSlot } from './EquipmentRenderer.js';

/**
 * EquipmentSystem - progresso dos EPIs conquistados.
 * Substitui o BadgeSystem do projeto original, mantendo a mesma ideia:
 * cada desafio correto desbloqueia um item e atualiza o HUD.
 */
export class EquipmentSystem {
  constructor() {
    this._unlocked = new Set();
  }

  unlock(id) {
    if (!EQUIPMENT_BY_ID[id]) return false;
    this._unlocked.add(id);
    return true;
  }

  has(id) {
    return this._unlocked.has(id);
  }

  hasByNorm(norm) {
    const item = equipmentList.find((equipment) => equipment.norm === norm);
    return item ? this._unlocked.has(item.id) : false;
  }

  getItem(id) {
    return getEquipment(id);
  }

  getAll() {
    return Array.from(this._unlocked);
  }

  getUnlockedItems() {
    return equipmentList.filter((item) => this._unlocked.has(item.id));
  }

  getMissing() {
    return equipmentList.filter((item) => !this._unlocked.has(item.id));
  }

  getCount() {
    return this._unlocked.size;
  }

  getTotal() {
    return TOTAL_EQUIPMENT;
  }

  getProgress() {
    return TOTAL_EQUIPMENT === 0 ? 0 : this._unlocked.size / TOTAL_EQUIPMENT;
  }

  isComplete() {
    return this._unlocked.size >= TOTAL_EQUIPMENT;
  }

  getColor(id) {
    return EQUIPMENT_BY_ID[id]?.color || '#ffffff';
  }

  loadFromArray(ids) {
    this._unlocked = new Set(
      (Array.isArray(ids) ? ids : []).filter((id) => Boolean(EQUIPMENT_BY_ID[id]))
    );
  }

  toArray() {
    return this.getAll();
  }

  renderBar(renderer, x, y, options = {}) {
    const {
      slotSize = 24,
      gap = 4,
      highlightId = null,
      pulse = 0,
      showLocked = true
    } = options;

    equipmentList.forEach((item, index) => {
      const unlocked = this.has(item.id);
      if (!unlocked && !showLocked) return;

      drawIconSlot(
        renderer,
        item.id,
        x + index * (slotSize + gap),
        y,
        slotSize,
        unlocked,
        {
          selected: highlightId === item.id,
          pulse: highlightId === item.id ? pulse : 0
        }
      );
    });
  }

  renderPreview(renderer, x, y, size = 28, gap = 6) {
    equipmentList.forEach((item, index) => {
      drawIconSlot(
        renderer,
        item.id,
        x + index * (size + gap),
        y,
        size,
        this.has(item.id)
      );
    });
  }
}
