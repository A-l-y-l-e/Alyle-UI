import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

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

    get disabled() { return this._superHyperInternalPropertyDisabled; }
    set disabled(value: any) { this._superHyperInternalPropertyDisabled = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
