import { TOWER_DEFS, TOWER_KINDS, type TowerKind } from '../data/towers.ts';
import type { Tower } from '../entities/Tower.ts';

export class HUD {
  private readonly root: HTMLDivElement;
  private readonly waveEl: HTMLElement;
  private readonly hpEl: HTMLElement;
  private readonly remainEl: HTMLElement;
  private readonly goldEl: HTMLElement;
  private readonly barEl: HTMLElement;
  private readonly upgradeBtn: HTMLButtonElement;
  private readonly onSelect: (kind: TowerKind) => void;
  private readonly onUpgrade: (tower: Tower) => void;
  private focused: Tower | null = null;

  constructor(
    host: HTMLElement,
    onSelect: (kind: TowerKind) => void,
    onUpgrade: (tower: Tower) => void,
  ) {
    this.onSelect = onSelect;
    this.onUpgrade = onUpgrade;
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
      <div class="panel">
        <div>Wave <strong data-wave>1 / 10</strong></div>
        <div>Tanks left <strong data-remain>0</strong></div>
        <div>Capital <strong data-hp>20</strong></div>
        <div>Gold <strong data-gold>100</strong></div>
        <div class="wave-bar"><span data-bar></span></div>
      </div>
      <div class="panel hud-actions">
        <span data-build></span>
        <button type="button" data-upgrade hidden>Upgrade</button>
      </div>
    `;
    host.appendChild(this.root);
    this.waveEl = must(this.root, '[data-wave]');
    this.hpEl = must(this.root, '[data-hp]');
    this.remainEl = must(this.root, '[data-remain]');
    this.goldEl = must(this.root, '[data-gold]');
    this.barEl = must(this.root, '[data-bar]');
    this.upgradeBtn = must(this.root, '[data-upgrade]') as HTMLButtonElement;
    this.upgradeBtn.addEventListener('click', () => {
      if (this.focused) this.onUpgrade(this.focused);
    });
    this.mountButtons();
    this.setSelected('cannon');
  }

  update(wave: number, total: number, hp: number, remain: number, gold: number, progress: number): void {
    this.waveEl.textContent = `${wave} / ${total}`;
    this.hpEl.textContent = String(hp);
    this.remainEl.textContent = String(remain);
    this.goldEl.textContent = String(gold);
    this.barEl.style.width = `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`;
    this.refreshUpgrade();
  }

  setFocused(tower: Tower | null): void {
    this.focused = tower;
    this.refreshUpgrade();
  }

  setSelected(kind: TowerKind): void {
    for (const button of this.root.querySelectorAll<HTMLButtonElement>('[data-kind]')) {
      button.classList.toggle('active', button.dataset.kind === kind);
    }
  }

  setVisible(visible: boolean): void {
    this.root.style.display = visible ? '' : 'none';
  }

  private refreshUpgrade(): void {
    if (!this.focused) {
      this.upgradeBtn.hidden = true;
      return;
    }
    this.upgradeBtn.hidden = false;
    this.upgradeBtn.textContent = `Upgrade Lv${this.focused.level + 1} · ${this.focused.upgradeCost()}g`;
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
  if (!el) throw new Error(`HUD missing ${selector}`);
  return el;
}
