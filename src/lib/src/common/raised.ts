import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanRaised {
  raised: boolean;
}

export function mixinRaised<T extends Constructor>(base: T): Constructor<CanRaised> & T {
  return class extends base {
    private _raised: boolean;

    get raised() { return this._raised; }
    set raised(value: any) { this._raised = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
