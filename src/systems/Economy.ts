export class Economy {
  private amount: number;

  constructor(start: number) {
    this.amount = start;
  }

  get gold(): number {
    return this.amount;
  }

  canAfford(cost: number): boolean {
    return this.amount >= cost;
  }

  spend(cost: number): boolean {
    if (!this.canAfford(cost)) {
      return false;
    }
    this.amount -= cost;
    return true;
  }

  earn(n: number): void {
    this.amount += n;
  }

  reset(start: number): void {
    this.amount = start;
  }
}
