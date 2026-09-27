export function bindPause(toggle: () => void): void {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key.toLowerCase() === 'p') {
      toggle();
    }
  });
}
