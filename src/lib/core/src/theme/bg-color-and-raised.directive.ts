import { Directive, Input, OnChanges, SimpleChanges, Inject, Optional, Renderer2, ElementRef, Host, Self } from '@angular/core';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyTheme, StyleData } from '../theme.service';
import { SkipSelf } from '@angular/core';
import { toBoolean } from '../minimal';
import { shadowBuilder } from '../shadow';
import { PALETTE, ThemeVariables } from '../alyle-config-service';

@Directive({
  selector: '[bg], [color], [raised]'
})
export class LyBgColorAndRaised implements OnChanges {
  private _raisedState: boolean;
  private _currentStyleData: StyleData;
  private _cssBg: string;
  private _cssColor: string;
  private _bg: string;
  private _color: string;
  @Input()
  set bg(value: string) {
    this._bg = value;
    this._cssBg = this.theme.colorOf(value);
  }
  get bg() {
    return this._bg;
  }
  get cssBg() {
    return this._cssBg;
  }
  @Input()
  set color(value: string) {
    this._color = value;
    this._cssColor = this.theme.colorOf(value);
  }
  get color() {
    return this._color;
  }
  get cssColor() {
    return this._cssColor;
  }
  @Input() set raised(val: boolean) { this._raisedState = toBoolean(val); }
  get raised() { return this._raisedState; }
  @Input() elevation = 3;
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(PALETTE) private palette: ThemeVariables,
    @Inject(LY_GLOBAL_CONTRAST) @Optional() private contrast: boolean
  ) { }

  public setAutoContrast() {
    this.contrast = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    let key;
    let newStyleData;
    if ((this.contrast && !this.color || this.color === 'auto') && this.bg) {
      key = `contrast${this.bg}${this._raisedState}${this.elevation}`;
      newStyleData = this.theme.createStyle(`ly-${key}`, this.contrastStyle.bind(this));
    } else if (this.bg && this.color) {
      key = `b&ĸ${this.bg}${this.color}${this._raisedState}${this.elevation}`;
      newStyleData = this.theme.createStyle(`ly-${key}`, this.bgColorStyle.bind(this));
    } else if (this.bg || this.color) {
      const changeKey = this.bg ? ['bg', 'background', this.bg] : ['ĸ', 'color', this.color];
      const color = changeKey[2];
      key = `${changeKey[0]}${color}${this._raisedState}${this.elevation}`;

      /** Create style */
      newStyleData = this.theme.createStyle(`ly-${key}`, () => {
        const _color = this._cssBg || this.cssColor;
        let styles = `${changeKey[1]}:${_color};`;
        if (this._raisedState) {
          styles += shadowBuilder(this.elevation, _color);
        }
        return styles;
      });

    } else {
      key = `raised${this._raisedState}${this.elevation}`;
      newStyleData = this.theme.createStyle(`ly-${key}`, () => {
        if (this._raisedState) {
          return shadowBuilder(this.elevation, this.palette.colorShadow);
        } else {
          return shadowBuilder(0, this.palette.colorShadow);
        }
      });
    }
    this.theme.updateClass(this.elementRef, this.renderer, newStyleData, this._currentStyleData);
    this._currentStyleData = newStyleData;
  }
  private contrastStyle() {
    this._color = this.theme.colorOf(`${this.bg}:contrast`);
    let styles = `background:${this._cssBg};color:${this._color};`;
    if (this._raisedState) {
      styles += shadowBuilder(this.elevation, this._cssBg);
    }
    return styles;
  }

  private bgColorStyle() {
    let styles = `background:${this._cssBg};color:${this._cssColor};`;
    if (this._raisedState) {
      styles += shadowBuilder(this.elevation, this._cssBg);
    }
    return styles;
  }
}
