import { Constructor } from './constructor';

export interface CanBg {
  bg: string | number;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyBg: string | number;
}

export function mixinBg<T extends Constructor>(base: T): Constructor<CanBg> & T {
  return class extends base {
    _superHyperInternalPropertyBg: string | number;

    get bg(): string | number { return this._superHyperInternalPropertyBg; }
    set bg(val: string | number) {
      const defaultColor = val;
      if (defaultColor !== this.bg) {
        this._superHyperInternalPropertyBg = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
