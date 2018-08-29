import { Directive, Input, OnChanges, ElementRef, Inject } from '@angular/core';
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
    this._isContrast = this._autoContrast && !this.color || this.color === 'auto';
    const newKey = `common----:${
      this.bg || DEFAULT_VALUE}·${
        this.color || DEFAULT_VALUE}·${
          this.raised || DEFAULT_VALUE}·${
            this.elevation || DEFAULT_VALUE}·${
              this.disabled || DEFAULT_VALUE}·${
                this.outlined || DEFAULT_VALUE}·${
                  this.shadowColor || DEFAULT_VALUE}·${
                    this._isContrast || DEFAULT_VALUE}`;
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
      if (this.outlined) {
        style.border = '1px solid currentColor';
      }
      if (this.disabled) {
        style.color = theme.text.disabled;
        style.pointerEvents = 'none';
        if (this.bg) {
          style.background = theme.button.disabled;
        }
      } else {
        if (this.bg) {
          style.background = theme.colorOf(this.bg);
          if (this._isContrast) {
            style.color = theme.colorOf(`${this.bg}:contrast`);
          }
        }
        if (!style.color && this.color) {
          style.color = theme.colorOf(this.color);
        }
        if (this.raised || this.elevation) {
          const shadowColor = (this.shadowColor && theme.colorOf(this.shadowColor)) || style.background || style.color || theme.colorShadow;
          if (!this.bg) {
            style.background = theme.background.primary;
          }
          style.boxShadow = shadowBuilder(this.elevation || 3, shadowColor);
          if (!this.elevation) {
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
