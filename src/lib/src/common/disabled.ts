import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanDisable {
  disabled: string;
}

export function mixinDisabled<T extends Constructor>(base: T): Constructor<CanDisable> & T {
  return class extends base {
    private _disabled: boolean = false;

    get disabled() { return this._disabled; }
    set disabled(value: any) { this._disabled = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
