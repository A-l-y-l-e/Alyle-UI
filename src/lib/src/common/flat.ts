import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanFlat {
  flat: boolean;
}

export function mixinFlat<T extends Constructor>(base: T): Constructor<CanFlat> & T {
  return class extends base {
    private _flat: boolean = false;

    get flat() { return this._flat; }
    set flat(value: any) { this._flat = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
