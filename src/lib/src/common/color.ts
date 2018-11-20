import { Constructor } from './constructor';

const DEFAULT_COLOR = 'primary';

export interface CanColor {
  color: string;
}

export function mixinColor<T extends Constructor>(base: T): Constructor<CanColor> & T {
  return class extends base {
    private _color: string;

    get color(): string { return this._color; }
    set color(val: string) {
      const defaultColor = val || DEFAULT_COLOR;
      if (defaultColor !== this.color) {
        this._color = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
