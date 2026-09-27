import { TOWER_DEFS, TOWER_KINDS, type TowerKind } from '../data/towers.ts';

export class HUD {
  private readonly root: HTMLDivElement;
  private readonly waveEl: HTMLElement;
  private readonly hpEl: HTMLElement;
  private readonly remainEl: HTMLElement;
  private readonly goldEl: HTMLElement;
  private readonly onSelect: (kind: TowerKind) => void;

  constructor(host: HTMLElement, onSelect: (kind: TowerKind) => void) {
    this.onSelect = onSelect;
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
      <div class="panel">
        <div>Wave <strong data-wave>1 / 3</strong></div>
        <div>Capital <strong data-hp>20</strong></div>
        <div>Enemies <strong data-remain>0</strong></div>
        <div>Gold <strong data-gold>100</strong></div>
      </div>
      <div class="panel hud-actions" data-build></div>
    `;
    host.appendChild(this.root);
    this.waveEl = must(this.root, '[data-wave]');
    this.hpEl = must(this.root, '[data-hp]');
    this.remainEl = must(this.root, '[data-remain]');
    this.goldEl = must(this.root, '[data-gold]');
    this.mountButtons();
    this.setSelected('cannon');
  }

  update(wave: number, total: number, capitalHp: number, remaining: number, gold: number): void {
    this.waveEl.textContent = `${wave} / ${total}`;
    this.hpEl.textContent = String(capitalHp);
    this.remainEl.textContent = String(remaining);
    this.goldEl.textContent = String(gold);
  }

  setSelected(kind: TowerKind): void {
    for (const button of this.root.querySelectorAll<HTMLButtonElement>('[data-kind]')) {
      button.classList.toggle('active', button.dataset.kind === kind);
    }
  }

  setVisible(visible: boolean): void {
    this.root.style.display = visible ? '' : 'none';
  }

  private mountButtons(): void {
    const bar = must(this.root, '[data-build]');
    for (const kind of TOWER_KINDS) {
      const def = TOWER_DEFS[kind];
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.kind = kind;
      button.textContent = `${def.name} · ${def.cost}g`;
      button.addEventListener('click', () => this.onSelect(kind));
      bar.appendChild(button);
    }
  }
}

function must(root: HTMLElement, selector: string): HTMLElement {
  const el = root.querySelector<HTMLElement>(selector);
  if (!el) {
    throw new Error(`HUD missing ${selector}`);
  }
  return el;
}
