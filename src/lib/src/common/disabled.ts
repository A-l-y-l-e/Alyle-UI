import { Constructor } from './constructor';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export interface CanDisable {
  disabled: boolean;
  /**
   * It is only used for common behavior, therefore, it should not be used for other purposes.
   */
  readonly _superHyperInternalPropertyDisabled: boolean;
}

/** @docs-private */
export type CanDisableCtor = Constructor<CanDisable>;

export function mixinDisabled<T extends Constructor>(base: T): CanDisableCtor & T {
  return class extends base {
    _superHyperInternalPropertyDisabled: boolean = false;

    get disabled(): boolean { return this._superHyperInternalPropertyDisabled; }
    set disabled(value: BooleanInput) { this._superHyperInternalPropertyDisabled = coerceBooleanProperty(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
