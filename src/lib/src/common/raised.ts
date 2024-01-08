import { Constructor } from './constructor';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

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

    get raised(): boolean { return this._superHyperInternalPropertyRaised; }
    set raised(value: BooleanInput) { this._superHyperInternalPropertyRaised = coerceBooleanProperty(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
