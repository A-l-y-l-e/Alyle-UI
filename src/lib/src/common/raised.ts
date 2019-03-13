import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanRaised {
  raised: boolean;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyRaised: boolean;
}

export function mixinRaised<T extends Constructor>(base: T): Constructor<CanRaised> & T {
  return class extends base {
    _superHyperInternalPropertyRaised: boolean;

    get raised() { return this._superHyperInternalPropertyRaised; }
    set raised(value: any) { this._superHyperInternalPropertyRaised = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
