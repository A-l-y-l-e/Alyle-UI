import { Constructor } from './constructor';

const DEFAULT_BG = 'primary';

export interface CanBg {
  bg: string;
}

export function mixinBg<T extends Constructor>(base: T): Constructor<CanBg> & T {
  return class extends base {
    private _bg: string;

    get bg(): string { return this._bg; }
    set bg(val: string) {
      const defaultColor = val || DEFAULT_BG;
      if (defaultColor !== this.bg) {
        this._bg = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
