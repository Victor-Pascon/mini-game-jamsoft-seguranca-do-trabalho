/**
 * Sound - efeitos sonoros procedurais com WebAudio.
 * Não depende de arquivos externos e nunca quebra o jogo caso o áudio
 * não esteja disponível ou seja bloqueado pelo navegador.
 */
export class Sound {
  constructor() {
    this._ctx = null;
    this._muted = false;
    try {
      this._muted = localStorage.getItem('jamsoft_seguranca_mute') === '1';
    } catch {
      this._muted = false;
    }
  }

  _ensure() {
    if (this._muted) return null;

    if (!this._ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this._ctx = new AudioContextClass();
    }

    if (this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }

    return this._ctx;
  }

  _tone(frequency, duration, type = 'square', volume = 0.035, delay = 0) {
    const ctx = this._ensure();
    if (!ctx) return;

    try {
      const start = ctx.currentTime + delay;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.010);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch {
      // Áudio é um bônus: falhas silenciosas não interrompem a experiência.
    }
  }

  playSelect() {
    this._tone(520, 0.06, 'square', 0.022);
  }

  playCorrect() {
    this._tone(523.25, 0.12, 'triangle', 0.04, 0);
    this._tone(659.25, 0.12, 'triangle', 0.04, 0.10);
    this._tone(783.99, 0.20, 'triangle', 0.04, 0.20);
  }

  playWrong() {
    this._tone(196.00, 0.16, 'sawtooth', 0.030, 0);
    this._tone(146.83, 0.22, 'sawtooth', 0.030, 0.12);
  }

  playUnlock() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((frequency, index) => {
      this._tone(frequency, 0.14, 'square', 0.032, index * 0.08);
    });
  }

  playManual() {
    this._tone(440, 0.06, 'square', 0.022, 0);
    this._tone(660, 0.08, 'square', 0.022, 0.06);
  }

  playStart() {
    const notes = [392.00, 523.25, 659.25];
    notes.forEach((frequency, index) => {
      this._tone(frequency, 0.12, 'triangle', 0.040, index * 0.10);
    });
  }

  playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((frequency, index) => {
      this._tone(frequency, 0.18, 'triangle', 0.042, index * 0.12);
    });
  }

  toggleMute() {
    this._muted = !this._muted;
    try {
      localStorage.setItem('jamsoft_seguranca_mute', this._muted ? '1' : '0');
    } catch {
      // Sem persistência de áudio: mantém apenas o estado em memória.
    }
    if (!this._muted) this.playSelect();
    return this._muted;
  }

  isMuted() {
    return this._muted;
  }
}
