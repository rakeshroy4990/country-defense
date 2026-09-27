export class Screens {
  private readonly menu: HTMLDivElement;
  private readonly pause: HTMLDivElement;
  private readonly result: HTMLDivElement;
  private readonly bestEl: HTMLElement;
  private readonly resultTitle: HTMLElement;
  private readonly resultBody: HTMLElement;

  constructor(
    host: HTMLElement,
    handlers: { onStart: () => void; onRestart: () => void; onResume: () => void },
  ) {
    this.menu = overlay(
      'Country Defense',
      'Five levels. Starscream, Barricade, Bonecrusher, Shockwave, then Megatron. Left-click grass to build. Kingdom hits are recorded.',
      'Start',
      handlers.onStart,
    );
    this.bestEl = document.createElement('p');
    this.bestEl.textContent = 'Best: —';
    this.menu.querySelector('.panel')?.appendChild(this.bestEl);

    this.pause = overlay('Paused', 'The front is quiet. Press Esc or P to resume.', 'Resume', handlers.onResume);
    this.result = overlay('Battle over', '', 'Restart', handlers.onRestart);
    this.resultTitle = this.result.querySelector('h1') ?? document.createElement('h1');
    this.resultBody = this.result.querySelector('p') ?? document.createElement('p');

    host.append(this.menu, this.pause, this.result);
    this.hideAll();
  }

  showMenu(best: string): void {
    this.hideAll();
    this.bestEl.textContent = best;
    this.menu.classList.remove('hidden');
  }

  showPause(): void {
    this.hideAll();
    this.pause.classList.remove('hidden');
  }

  showResult(title: string, body: string): void {
    this.hideAll();
    this.resultTitle.textContent = title;
    this.resultBody.textContent = body;
    this.result.classList.remove('hidden');
  }

  hideAll(): void {
    this.menu.classList.add('hidden');
    this.pause.classList.add('hidden');
    this.result.classList.add('hidden');
  }
}

function overlay(title: string, body: string, action: string, onClick: () => void): HTMLDivElement {
  const root = document.createElement('div');
  root.className = 'overlay hidden';
  root.innerHTML = `
    <div class="panel">
      <h1></h1>
      <p></p>
      <button type="button"></button>
    </div>
  `;
  const h = root.querySelector('h1');
  const p = root.querySelector('p');
  const button = root.querySelector('button');
  if (h) h.textContent = title;
  if (p) p.textContent = body;
  if (button) {
    button.textContent = action;
    button.addEventListener('click', onClick);
  }
  return root;
}
