import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanDisableRipple {
  disableRipple: boolean;
}

export function mixinDisableRipple<T extends Constructor>(base: T): Constructor<CanDisableRipple> & T {
  return class extends base {
    private _disableRipple: boolean;

    get disableRipple(): boolean { return this._disableRipple; }
    set disableRipple(val: boolean) {
      this._disableRipple = toBoolean(val);
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
