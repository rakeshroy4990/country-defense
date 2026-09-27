import './style.css';
import { Game } from './core/Game.ts';

const host = document.querySelector<HTMLDivElement>('#app');
if (!host) {
  throw new Error('#app is missing');
}

new Game(host);
