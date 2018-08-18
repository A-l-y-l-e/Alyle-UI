import { Directive, Input, OnChanges, ElementRef } from '@angular/core';
import { LyTheme2 } from './theme2.service';
import { toBoolean } from '../minimal';
import { shadowBuilder } from '../shadow';

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
  ) {}

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
    this._className = this.theme.addStyle<any>(newKey, (theme) => {
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
          style.background = this.theme.colorOf(this.bg);
          if (this._isContrast) {
            style.color = this.theme.colorOf(`${this.bg}:contrast`);
          }
        }
        if (!style.color && this.color) {
          style.color = this.theme.colorOf(this.color);
        }
        if (this.raised || this.elevation) {
          const shadowColor = (this.shadowColor && this.theme.colorOf(this.shadowColor)) || style.background || style.color || theme.colorShadow;
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
    /**~ */
    // const raisedĸey = this.raised === true ? 'raised' : '';
    // let key = '';
    // if ((this.contrast && !this.color || this.color === 'auto') && this.bg) {
    //   key = `bcr-contrast:${this.bg}${raisedĸey}${this.elevation}`;
    //   this._className = this.theme.addStyle(`ly-${key}`, this.contrastStyle.bind(this), this._getHostElement(), this._className);
    // } else if (this.bg && this.color) {
    //   key = `b&ĸ${this.bg}${this.color}${this.raised}${this.elevation}`;
    //   this._className = this.theme.addStyle(`ly-${key}`, this.bgColorStyle.bind(this), this._getHostElement(), this._className);
    // } else if (this.raised && !this.bg) {
    //   key = raisedĸey + this.color || '';
    //   this._className = this.theme.addStyle<any>(`ly-${key}`, theme => {
    //     let styles = `background-color:${theme.background.primary};`;
    //     let color = '';
    //     let colorShadow;
    //     if (this.color) {
    //       color = this.theme.colorOf(this.color);
    //       colorShadow = color;
    //       styles += `color:${color};`;
    //     } else {
    //       colorShadow = theme.colorShadow;
    //     }
    //     if (this._raised) {
    //       styles += shadowBuilderDeprecated(this.elevation, colorShadow);
    //     }
    //     return styles;
    //   }, this._getHostElement(), this._className);
    // } else if (this.bg || this.color) {
    //   const changeKey = this.bg ? ['bg', 'background', this.bg] : ['ĸ', 'color', this.color];
    //   const color = changeKey[2];
    //   key = `${changeKey[0]}${color}${this._raised}${this.elevation}`;

    //   /** Create style */
    //   this._className = this.theme.addStyle(`ly-${key}`, () => {
    //     const _color = this.theme.colorOf(this.bg || this.color);
    //     let styles = `${changeKey[1]}:${_color};`;
    //     if (this._raised) {
    //       styles += shadowBuilderDeprecated(this.elevation, _color);
    //     }
    //     return styles;
    //   }, this._getHostElement(), this._className);

    // } else {
    //   key = `raised${this._raised}elxxxxxxxx${this.elevation}`;
    //   this._className = this.theme.addStyle(`ly-${key}`, () => {
    //     if (this._raised) {
    //       return shadowBuilderDeprecated(this.elevation, this.theme.config.colorShadow);
    //     } else {
    //       return shadowBuilderDeprecated(0, this.theme.config.colorShadow);
    //     }
    //   }, this._getHostElement(), this._className);
    // }
  }
  // private contrastStyle() {
  //   const cssBg = this.theme.colorOf(this.bg);
  //   this._color = this.theme.colorOf(`${this.bg}:contrast`);
  //   let styles = `background:${cssBg};color:${this._color};`;
  //   if (this._raised) {
  //     styles += shadowBuilderDeprecated(this.elevation, cssBg);
  //   }
  //   return styles;
  // }

  // private bgColorStyle() {
  //   const cssBg = this.theme.colorOf(this.bg);
  //   const cssColor = this.theme.colorOf(this.color);
  //   let styles = `background:${cssBg};color:${cssColor};`;
  //   if (this._raised) {
  //     styles += shadowBuilderDeprecated(this.elevation, cssBg);
  //   }
  //   return styles;
  // }

  private _getHostElement() {
    return this.elementRef.nativeElement;
  }
}

const DEFAULT_VALUE = '';
