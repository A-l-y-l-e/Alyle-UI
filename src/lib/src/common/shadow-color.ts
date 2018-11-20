import { Constructor } from './constructor';

export interface CanShadowColor {
  shadowColor: string;
}

export function mixinShadowColor<T extends Constructor>(base: T): Constructor<CanShadowColor> & T {
  return class extends base {
    private _shadowColor: string;

    get shadowColor(): string { return this._shadowColor; }
    set shadowColor(value: string) { this._shadowColor = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
