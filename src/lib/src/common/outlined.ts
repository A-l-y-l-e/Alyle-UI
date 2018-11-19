import { Constructor } from './constructor';
import { toBoolean } from '../minimal/is-boolean';

export interface CanOutlined {
  outlined: boolean;
}

export function mixinOutlined<T extends Constructor>(base: T): Constructor<CanOutlined> & T {
  return class extends base {
    private _outlined: boolean;

    get outlined() { return this._outlined; }
    set outlined(value: any) { this._outlined = toBoolean(value); }

    constructor(...args: any[]) { super(...args); }
  };
}
