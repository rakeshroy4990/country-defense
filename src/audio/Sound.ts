/**
 * Placeholder tones until real files are dropped in /public/sfx.
 * TODO freesound.org swaps:
 *  - shoot: "rifle crack short"
 *  - death: "small explosion cartoon"
 *  - leak: "impact thud dull"
 */
export class Sound {
  private ctx: AudioContext | null = null;

  unlock(): void {
    this.ctx ??= new AudioContext();
    void this.ctx.resume();
  }

  shoot(): void {
    this.tone(520, 0.05, 'square', 0.04);
  }

  death(): void {
    this.tone(170, 0.14, 'sawtooth', 0.05);
  }

  leak(): void {
    this.tone(88, 0.2, 'triangle', 0.06);
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gain: number,
  ): void {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') {
      return;
    }
    const osc = ctx.createOscillator();
    const node = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    node.gain.setValueAtTime(gain, ctx.currentTime);
    node.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(node);
    node.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }
}
