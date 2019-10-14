import { Constructor } from './constructor';
import { Color } from '@alyle/ui/color';

export interface CanShadowColor {
  shadowColor: string | number | Color;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyShadowColor: string | number | Color;
}

export function mixinShadowColor<T extends Constructor>(base: T): Constructor<CanShadowColor> & T {
  return class extends base {
    _superHyperInternalPropertyShadowColor: string | number | Color;

    get shadowColor(): string | number | Color { return this._superHyperInternalPropertyShadowColor; }
    set shadowColor(value: string | number | Color) { this._superHyperInternalPropertyShadowColor = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
