import { Constructor } from './constructor';

export interface CanElevation {
  elevation: number;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyElevation: number;
}

export function mixinElevation<T extends Constructor>(base: T): Constructor<CanElevation> & T {
  return class extends base {
    _superHyperInternalPropertyElevation: number;

    get elevation() { return this._superHyperInternalPropertyElevation; }
    set elevation(value: any) { this._superHyperInternalPropertyElevation = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
