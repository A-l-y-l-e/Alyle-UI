import { Constructor } from './constructor';

const DEFAULT_BG = 'primary';

export interface CanBg {
  bg: string;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyBg: string;
}

export function mixinBg<T extends Constructor>(base: T): Constructor<CanBg> & T {
  return class extends base {
    _superHyperInternalPropertyBg: string;

    get bg(): string { return this._superHyperInternalPropertyBg; }
    set bg(val: string) {
      const defaultColor = val || DEFAULT_BG;
      if (defaultColor !== this.bg) {
        this._superHyperInternalPropertyBg = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
