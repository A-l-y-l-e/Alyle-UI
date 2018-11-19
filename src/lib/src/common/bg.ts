import { Constructor } from './constructor';
import { CanColor, HasElementRefAndLyTheme2 } from './color';
import { CanDisable } from './disabled';
import { ThemeVariables } from '../theme/theme-config';

const STYLE_PRIORITY = -1;
const DEFAULT_BG = 'primary';

export interface CanBg {
  bg: string;
}

export function mixinBg<T extends Constructor<Partial<CanDisable> & Partial<CanColor> & HasElementRefAndLyTheme2>>(base: T): Constructor<CanBg> & T {
  return class extends base {
    private _bg: string;
    private _bgClass: string;

    get bg(): string { return this._bg; }
    set bg(val: string) {
      const defaultColor = val || DEFAULT_BG;
      if (defaultColor !== this.bg) {
        this._bgClass = this._theme.addStyle(`bg:${defaultColor}`, (theme: ThemeVariables) => ({
          background: theme.colorOf(defaultColor)
        }), this._el.nativeElement, this._bgClass, STYLE_PRIORITY);
        this._bg = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
