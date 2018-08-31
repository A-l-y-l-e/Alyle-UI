import { Directive, Input, OnChanges, ElementRef } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { toBoolean } from '../minimal';
import { shadowBuilder } from '../shadow';

const DEFAULT_VALUE = '';

@Directive({
  selector: `
            [bg],
            [color],
            [raised],
            [raised][shadowColor],
            [ly-button][outlined],
            [elevation],
            [elevation][shadowColor],
            [disabled],
            ly-card
            `
})
export class LyCommon implements OnChanges {
  private _raised: boolean;
  private _outlined: boolean;
  private _disabled: boolean;
  private _className: string;
  private _autoContrast: boolean;
  private _isContrast: boolean;

  @Input() bg: string;

  @Input() color: string;

  @Input() set raised(val: boolean) { this._raised = toBoolean(val); }
  get raised() { return this._raised; }

  @Input() set disabled(val: boolean) { this._disabled = toBoolean(val); }
  get disabled() { return this._disabled; }

  @Input() set outlined(val: boolean) { this._outlined = toBoolean(val); }
  get outlined() { return this._outlined; }

  @Input() elevation: number;
  @Input() shadowColor: string;
  constructor(
    private theme: LyTheme2,
    private elementRef: ElementRef
  ) { }

  public setAutoContrast() {
    this._autoContrast = true;
  }

  ngOnChanges() {
    const __bg = this.bg;
    const __color = this.color;
    const __raised = this.raised;
    const __elevation = this.elevation;
    const __disabled = this.disabled;
    const __outlined = this.outlined;
    const __shadowColor = this.shadowColor;
    const __isContrast = this._isContrast = this._autoContrast && !__color || __color === 'auto';
    const newKey = `common----:${
      __bg || DEFAULT_VALUE}·${
        __color || DEFAULT_VALUE}·${
          __raised || DEFAULT_VALUE}·${
            __elevation || DEFAULT_VALUE}·${
              __disabled || DEFAULT_VALUE}·${
                __outlined || DEFAULT_VALUE}·${
                  __shadowColor || DEFAULT_VALUE}·${
                    __isContrast || DEFAULT_VALUE}`;
    this._className = this.theme.addStyle(newKey, (theme) => {
      const style: {
        border?: string,
        background?: string,
        color?: string,
        boxShadow?: string,
        pointerEvents?: 'none';
        '&:hover'?: {
          boxShadow?: string
        },
        '&:active'?: {
          boxShadow?: string
        }
      } = {};
      if (__outlined) {
        style.border = '1px solid currentColor';
      }
      if (__disabled) {
        style.color = theme.text.disabled;
        style.pointerEvents = 'none';
        if (__bg) {
          style.background = theme.button.disabled;
        }
      } else {
        if (__bg) {
          style.background = theme.colorOf(__bg);
          if (__isContrast) {
            style.color = theme.colorOf(`${__bg}:contrast`);
          }
        }
        if (!style.color && __color) {
          style.color = theme.colorOf(__color);
        }
        if (__raised || __elevation) {
          const shadowColor = (__shadowColor && theme.colorOf(__shadowColor)) || style.background || style.color || theme.colorShadow;
          if (!__bg) {
            style.background = theme.background.primary;
          }
          style.boxShadow = shadowBuilder(__elevation || 3, shadowColor);
          if (!__elevation) {
            style['&:active'] = {
              boxShadow: shadowBuilder(8, shadowColor)
            };
          }
        }
      }
      return style as any;
    }, this._getHostElement(), this._className);
  }

  private _getHostElement() {
    return this.elementRef.nativeElement;
  }
}
