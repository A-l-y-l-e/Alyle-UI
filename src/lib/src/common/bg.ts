import { Constructor } from './constructor';
import { Color } from '@alyle/ui/color';

export interface CanBg {
  bg: string | number | Color;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyBg: string | number | Color;
}

export function mixinBg<T extends Constructor>(base: T): Constructor<CanBg> & T {
  return class extends base {
    _superHyperInternalPropertyBg: string | number | Color;

    get bg(): string | number | Color { return this._superHyperInternalPropertyBg; }
    set bg(val: string | number | Color) {
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
