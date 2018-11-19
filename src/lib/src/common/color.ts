import { ElementRef } from '@angular/core';
import { Constructor } from './constructor';
import { LyTheme2 } from '../theme/theme2.service';
import { ThemeVariables } from '../theme/theme-config';

const STYLE_PRIORITY = -1;
const DEFAULT_COLOR = 'primary';

export interface HasElementRefAndLyTheme2 {
  _el: ElementRef;
  _theme: LyTheme2;
}

export interface CanColor {
  color: string;
}

export function mixinColor<T extends Constructor<HasElementRefAndLyTheme2>>(base: T): Constructor<CanColor> & T {
  return class extends base {
    private _color: string;
    private _colorClass: string;

    get color(): string { return this._color; }
    set color(val: string) {
      const defaultColor = val || DEFAULT_COLOR;
      if (defaultColor !== this.color) {
        this._colorClass = this._theme.addStyle(`color:${defaultColor}`, (theme: ThemeVariables) => ({
          color: theme.colorOf(defaultColor)
        }), this._el.nativeElement, this._colorClass, STYLE_PRIORITY);
        this._color = defaultColor;
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
