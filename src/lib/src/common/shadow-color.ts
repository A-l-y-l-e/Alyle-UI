import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanRaised {
  shadowColor: string;
}

export function mixinRaised<T extends Constructor>(base: T): Constructor<CanRaised> & T {
  return class extends base {
    private _shadowColor: string;

    get shadowColor(): string { return this._shadowColor; }
    set shadowColor(value: string) { this._shadowColor = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
