/**
 * SaveSystem - persistência do progresso em localStorage.
 * Salva posição do jogador, EPIs conquistados, desafios concluídos, a fase
 * linear atual, o tempo de jogo e a decoração equipada.
 */
export class SaveSystem {
  constructor() {
    this._key = 'jamsoft_seguranca_save';
    this._version = '3.1';
  }

  save(data) {
    try {
      const saveData = {
        timestamp: Date.now(),
        version: this._version,
        ...data
      };
      localStorage.setItem(this._key, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;

      return data;
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      return null;
    }
  }

  hasSave() {
    try {
      return localStorage.getItem(this._key) !== null;
    } catch {
      return false;
    }
  }

  delete() {
    try {
      localStorage.removeItem(this._key);
    } catch {
      // localStorage indisponível: o jogo continua sem persistência.
    }
  }

  saveGame(player, equipmentIds = [], completedChallenges = [], phase = 0, playTime = 0) {
    const playerData = player && typeof player.getSaveData === 'function'
      ? player.getSaveData()
      : {
          x: player?.x ?? 0,
          y: player?.y ?? 0
        };

    return this.save({
      player: playerData,
      equipment: Array.from(equipmentIds),
      completedChallenges: Array.from(completedChallenges),
      phase: Number.isInteger(phase) ? phase : 0,
      playTime: Number.isFinite(playTime) ? Math.max(0, playTime) : 0,
      saveDate: new Date().toLocaleString('pt-BR')
    });
  }

  loadGame() {
    const data = this.load();
    if (!data) return null;

    return {
      player: data.player || null,
      equipment: Array.isArray(data.equipment) ? data.equipment : [],
      completedChallenges: Array.isArray(data.completedChallenges)
        ? data.completedChallenges
        : [],
      phase: Number.isInteger(data.phase) ? data.phase : null,
      playTime: Number.isFinite(data.playTime) ? Math.max(0, data.playTime) : 0,
      saveDate: data.saveDate || null
    };
  }

  exportSave() {
    const data = this.load();
    return data ? btoa(unescape(encodeURIComponent(JSON.stringify(data)))) : null;
  }

  importSave(base64Data) {
    try {
      const json = decodeURIComponent(escape(atob(base64Data)));
      const data = JSON.parse(json);
      this.save(data);
      return true;
    } catch (error) {
      console.error('Erro ao importar save:', error);
      return false;
    }
  }
}
