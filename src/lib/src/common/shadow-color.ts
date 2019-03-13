import { Constructor } from './constructor';

export interface CanShadowColor {
  shadowColor: string;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyShadowColor: string;
}

export function mixinShadowColor<T extends Constructor>(base: T): Constructor<CanShadowColor> & T {
  return class extends base {
    _superHyperInternalPropertyShadowColor: string;

    get shadowColor(): string { return this._superHyperInternalPropertyShadowColor; }
    set shadowColor(value: string) { this._superHyperInternalPropertyShadowColor = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
