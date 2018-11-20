import { Constructor } from './constructor';

export interface CanElevation {
  elevation: number;
}

export function mixinElevation<T extends Constructor>(base: T): Constructor<CanElevation> & T {
  return class extends base {
    private _elevation: number;

    get elevation() { return this._elevation; }
    set elevation(value: any) { this._elevation = value; }

    constructor(...args: any[]) { super(...args); }
  };
}
