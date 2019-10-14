import { Constructor } from './constructor';
import { Color } from '@alyle/ui/color';

export interface CanColor {
  color: string | number | Color;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyColor: string | number | Color;
}

export function mixinColor<T extends Constructor>(base: T): Constructor<CanColor> & T {
  return class extends base {
    _superHyperInternalPropertyColor: string | number | Color;

    get color(): string | number | Color { return this._superHyperInternalPropertyColor; }
    set color(val: string | number | Color) {
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
