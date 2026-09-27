import { TOWER_DEFS, TOWER_KINDS, type TowerKind } from '../data/towers.ts';
import type { Tower } from '../entities/Tower.ts';
import type { DamageRecord } from '../systems/KingdomLog.ts';

export class HUD {
  private readonly root: HTMLDivElement;
  private readonly levelEl: HTMLElement;
  private readonly nameEl: HTMLElement;
  private readonly incomingEl: HTMLElement;
  private readonly hpEl: HTMLElement;
  private readonly remainEl: HTMLElement;
  private readonly goldEl: HTMLElement;
  private readonly barEl: HTMLElement;
  private readonly hitsEl: HTMLElement;
  private readonly takenEl: HTMLElement;
  private readonly logEl: HTMLOListElement;
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
        <div>Level <strong data-level>1 / 5</strong> · <span data-lname>Sky Raid</span></div>
        <div>Incoming <strong data-incoming>Starscream</strong></div>
        <div>Attackers left <strong data-remain>0</strong></div>
        <div>Kingdom HP <strong data-hp>20</strong></div>
        <div>Gold <strong data-gold>100</strong></div>
        <div class="wave-bar"><span data-bar></span></div>
      </div>
      <div class="panel hud-actions">
        <span data-build></span>
        <button type="button" data-upgrade hidden>Upgrade</button>
      </div>
      <div class="panel damage-log">
        <div>Kingdom damage</div>
        <div><strong data-hits>0 hits</strong> · total <strong data-taken>0</strong></div>
        <ol data-log></ol>
      </div>
    `;
    host.appendChild(this.root);
    this.levelEl = must(this.root, '[data-level]');
    this.nameEl = must(this.root, '[data-lname]');
    this.incomingEl = must(this.root, '[data-incoming]');
    this.remainEl = must(this.root, '[data-remain]');
    this.hpEl = must(this.root, '[data-hp]');
    this.goldEl = must(this.root, '[data-gold]');
    this.barEl = must(this.root, '[data-bar]');
    this.hitsEl = must(this.root, '[data-hits]');
    this.takenEl = must(this.root, '[data-taken]');
    this.logEl = must(this.root, '[data-log]') as HTMLOListElement;
    this.upgradeBtn = must(this.root, '[data-upgrade]') as HTMLButtonElement;
    this.upgradeBtn.addEventListener('click', () => {
      if (this.focused) this.onUpgrade(this.focused);
    });
    this.mountButtons();
    this.setSelected('cannon');
  }

  update(
    level: number,
    total: number,
    levelName: string,
    incoming: string,
    hp: number,
    remain: number,
    gold: number,
    progress: number,
  ): void {
    this.levelEl.textContent = `${level} / ${total}`;
    this.nameEl.textContent = levelName;
    this.incomingEl.textContent = incoming || '—';
    this.hpEl.textContent = String(hp);
    this.remainEl.textContent = String(remain);
    this.goldEl.textContent = String(gold);
    this.barEl.style.width = `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`;
    this.refreshUpgrade();
  }

  setDamageLog(hits: number, total: number, rows: DamageRecord[]): void {
    this.hitsEl.textContent = `${hits} hit${hits === 1 ? '' : 's'}`;
    this.takenEl.textContent = String(total);
    this.logEl.replaceChildren();
    for (const row of rows) {
      const item = document.createElement('li');
      item.textContent = `${row.attacker} dealt ${row.damage} · HP ${row.hpLeft}`;
      this.logEl.appendChild(item);
    }
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
    this.upgradeBtn.hidden = !this.focused;
    if (this.focused) {
      this.upgradeBtn.textContent = `Upgrade Lv${this.focused.level + 1} · ${this.focused.upgradeCost()}g`;
    }
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
