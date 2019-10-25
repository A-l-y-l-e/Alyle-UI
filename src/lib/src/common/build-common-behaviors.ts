import { Color } from '@alyle/ui/color';
import { Constructor } from './constructor';
import { shadowBuilder } from '../shadow';
import { CanColor } from './color';
import { CanBg } from './bg';
import { CanDisable } from './disabled';
import { CanRaised } from './raised';
import { CanElevation } from './elevation';
import { CanOutlined } from './outlined';
import { CanShadowColor } from './shadow-color';
import { LyTheme2 } from '../theme/theme2.service';
import { ElementRef } from '@angular/core';
import { getNativeElement } from '../minimal/common';
import { ThemeVariables } from '../theme/theme-config';
import { lyl } from '../parse';

const DEFAULT_VALUE = '';
const STYLE_PRIORITY = -1;

export interface RequireParamsStyleUpdater {
  _theme: LyTheme2;
}

export interface CanStyleUpdater {
  _theme: LyTheme2;
  updateStyle: (element: ElementRef | Element) => void;
  setAutoContrast: () => void;
}
export type CanStyleUpdaterCtor = Constructor<RequireParamsStyleUpdater & Partial<CanColor & CanBg & CanDisable & CanRaised & CanElevation & CanOutlined & CanShadowColor>>;

export function mixinStyleUpdater<T extends CanStyleUpdaterCtor>(base: T): Constructor<CanStyleUpdater> & T {
  return class extends base {
    _classNameAnonymous: string;
    _autoContrast: boolean;
    setAutoContrast() {
      this._autoContrast = true;
    }
    updateStyle(element: ElementRef<any> | HTMLElement) {
      const __bg = this._superHyperInternalPropertyBg;
      const __color = this._superHyperInternalPropertyColor === 'auto'
        ? ''
        : this._superHyperInternalPropertyColor;
      const __raised = this._superHyperInternalPropertyRaised;
      const __elevation = this._superHyperInternalPropertyElevation;
      const __disabled = this._superHyperInternalPropertyDisabled;
      const __outlined = this._superHyperInternalPropertyOutlined;
      const __shadowColor = this._superHyperInternalPropertyShadowColor;
      const __isContrast = this._autoContrast || this._superHyperInternalPropertyColor === 'auto';
      const el = getNativeElement(element);

      const newKey = `common----:${
        __bg || DEFAULT_VALUE}·${
          __color || DEFAULT_VALUE}·${
            __raised}·${
              __elevation}·${
                __disabled || DEFAULT_VALUE}·${
                  __outlined || DEFAULT_VALUE}·${
                    __shadowColor || DEFAULT_VALUE}·${
                      __isContrast || DEFAULT_VALUE}`;
      const newClass = this._theme.renderStyle(newKey, (theme: ThemeVariables) => {
        let sColor: Color | undefined;
        let sBackground: Color | undefined;
        let sBorder: string | undefined;
        let sPointerEvents: string | undefined;
        let sBoxShadow: string | undefined;
        let sBoxShadowActive: string | undefined;

        if (__outlined) {
          sBorder = '1px solid currentColor';
        }
        if (__disabled) {
          sColor = theme.disabled.contrast;
          sPointerEvents = 'none';
          if (__bg) {
            sBackground = theme.disabled.default;
          }
        } else {
          if (__bg) {
            sBackground = colorOf(theme, __bg);
            if (__isContrast && !__color) {
              sColor = theme.colorOf(`${__bg}:contrast`);

              // Generate auto contrast if is necessary
              if (sColor.css().includes('invalid')) {
                const lum = (__bg instanceof Color ? __bg : theme.colorOf(__bg)).luminance();
                sColor = lum < 0.5 ? theme.paper.default : theme.text.default;
              }
            }
          }
          if (!sColor && __color) {
            sColor = colorOf(theme, __color);
          }
          if (__raised || (__elevation != null)) {
            if (!__bg) {
              sBackground = theme.background.primary.default;
            }
            const backgroundColorCss = sBackground !== __bg && colorOf(theme, __bg || 'background:primary', 'shadow');
            const shadowColor = (__shadowColor && colorOf(theme, __shadowColor)) || backgroundColorCss || sBackground || sColor || theme.shadow;
            if (__elevation != null) {
              sBoxShadow = shadowBuilder(__elevation, shadowColor);
            } else {
              sBoxShadow = shadowBuilder(3, shadowColor);
              sBoxShadowActive = shadowBuilder(8, shadowColor);
            }
          }
        }
        return lyl `{
          ${`color: ${sColor}`}
          ${`background: ${sBackground}`}
          ${`border: ${sBorder}`}
          ${`pointer-events: ${sPointerEvents}`}
          ${`box-shadow: ${sBoxShadow}`}
          &:active {
            ${sBoxShadowActive && `box-shadow: ${sBoxShadowActive}`}
          }
        }`;
      }, STYLE_PRIORITY);

      el.classList.remove(this._classNameAnonymous);
      el.classList.add(newClass);
      this._classNameAnonymous = newClass;
    }

    constructor(...args: any[]) { super(...args); }
  };
}

function colorOf(theme: ThemeVariables, color: string | number | Color, optional?: string) {
  return color instanceof Color ? color : theme.colorOf(color, optional);
}
