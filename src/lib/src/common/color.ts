import { Constructor } from './constructor';

export interface CanColor {
  color: string | number;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyColor: string | number;
}

export function mixinColor<T extends Constructor>(base: T): Constructor<CanColor> & T {
  return class extends base {
    _superHyperInternalPropertyColor: string | number;

    get color(): string | number { return this._superHyperInternalPropertyColor; }
    set color(val: string | number) {
      const defaultColor = val;
      if (defaultColor !== this.color) {
        this._superHyperInternalPropertyColor = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
