import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanDisable {
  disabled: boolean;
}

/** @docs-private */
export type CanDisableCtor = Constructor<CanDisable>;

export function mixinDisabled<T extends Constructor>(base: T): CanDisableCtor & T {
  return class extends base {
    private _disabled: boolean = false;

    get disabled() { return this._disabled; }
    set disabled(value: any) { this._disabled = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
