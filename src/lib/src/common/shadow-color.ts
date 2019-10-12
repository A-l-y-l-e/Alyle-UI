import { Constructor } from './constructor';

export interface CanShadowColor {
  shadowColor: string | number;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyShadowColor: string | number;
}

export function mixinShadowColor<T extends Constructor>(base: T): Constructor<CanShadowColor> & T {
  return class extends base {
    _superHyperInternalPropertyShadowColor: string | number;

    get shadowColor(): string | number { return this._superHyperInternalPropertyShadowColor; }
    set shadowColor(value: string | number) { this._superHyperInternalPropertyShadowColor = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
