import { Game } from './game/Game.js';

const canvas = document.getElementById('game-canvas');

if (!canvas) {
  throw new Error('Canvas #game-canvas não encontrado.');
}

const game = new Game(canvas);
game.start();

// Facilita inspeção durante a feira/QA sem interferir no jogo.
window.__JAMSOFT_GAME__ = game;

const bootOverlay = document.getElementById('boot-overlay');
if (bootOverlay) {
  requestAnimationFrame(() => {
    bootOverlay.classList.add('is-hidden');
    setTimeout(() => bootOverlay.remove(), 350);
  });
}
