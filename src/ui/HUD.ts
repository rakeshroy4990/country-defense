export class HUD {
  private readonly root: HTMLDivElement;
  private readonly waveEl: HTMLElement;
  private readonly hpEl: HTMLElement;
  private readonly remainEl: HTMLElement;

  constructor(host: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
      <div class="panel">
        <div>Wave <strong data-wave>1 / 3</strong></div>
        <div>Capital <strong data-hp>20</strong></div>
        <div>Enemies <strong data-remain>0</strong></div>
      </div>
    `;
    host.appendChild(this.root);
    this.waveEl = must(this.root, '[data-wave]');
    this.hpEl = must(this.root, '[data-hp]');
    this.remainEl = must(this.root, '[data-remain]');
  }

  update(wave: number, total: number, capitalHp: number, remaining: number): void {
    this.waveEl.textContent = `${wave} / ${total}`;
    this.hpEl.textContent = String(capitalHp);
    this.remainEl.textContent = String(remaining);
  }

  get rootEl(): HTMLDivElement {
    return this.root;
  }
}

function must(root: HTMLElement, selector: string): HTMLElement {
  const el = root.querySelector<HTMLElement>(selector);
  if (!el) {
    throw new Error(`HUD missing ${selector}`);
  }
  return el;
}
