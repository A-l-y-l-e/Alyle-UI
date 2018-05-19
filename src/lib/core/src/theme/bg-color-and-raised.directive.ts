import { Directive, Input, OnChanges, SimpleChanges, Inject, Optional, Renderer2, ElementRef, Host, Self } from '@angular/core';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyTheme } from '../theme.service';
import { SkipSelf } from '@angular/core';
import { toBoolean } from '../minimal';
import { shadowBuilder } from '../shadow';
import { ThemeVariables } from '../alyle-config-service';
import { LyShadowService } from './shadow.service';

@Directive({
  selector: '[bg], [color], [raised]'
})
export class LyBgColorAndRaised implements OnChanges {
  private _raisedState: boolean;
  private _currentClassName: string;
  private _bg: string;
  private ĸbg: string;
  private _color: string;
  @Input()
  set bg(value: string) {
    this._bg = value;
    // this._cssBg = this.theme.colorOf(value);
  }
  get bg() {
    return this._bg;
  }
  // get cssBg() {
  //   return this._cssBg;
  // }
  @Input()
  set color(value: string) {
    this._color = value;
    // this._cssColor = this.theme.colorOf(value);
  }
  get color() {
    return this._color;
  }
  // get cssColor() {
  //   return this._cssColor;
  // }
  @Input() set raised(val: boolean) { this._raisedState = toBoolean(val); }
  get raised() { return this._raisedState; }
  @Input() elevation = 3;
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private shadow: LyShadowService,
    @Inject(LY_GLOBAL_CONTRAST) @Optional() private contrast: boolean
  ) { }

  public setAutoContrast() {
    this.contrast = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    let newClassName;
    /**~ */
    const raisedĸey = this._raisedState === true ? 'raised' : '';
    let key = '';
    if ((this.contrast && !this.color || this.color === 'auto') && this.bg) {
      key = `contrast${this.bg}${this._raisedState}${this.elevation}`;
      newClassName = this.theme.setStyle(`ly-${key}`, this.contrastStyle.bind(this));
    } else if (this.bg && this.color) {
      key = `b&ĸ${this.bg}${this.color}${this._raisedState}${this.elevation}`;
      newClassName = this.theme.setStyle(`ly-${key}`, this.bgColorStyle.bind(this));
    } else if (this.raised && !this.bg) {
      key = raisedĸey + this.color || '';
      newClassName = this.theme.setStyle(`ly-${key}`, () => {
        let styles = `background-color:${this.theme.palette.background.primary};`;
        let color = '';
        let colorShadow;
        if (this.color) {
          color = this.theme.colorOf(this.color);
          colorShadow = color;
          styles += `color:${color};`;
        } else {
          colorShadow = this.theme.palette.colorShadow;
        }
        if (this._raisedState) {
          styles += shadowBuilder(this.elevation, colorShadow);
        }
        return styles;
      });
    } else if (this.bg || this.color) {
      const changeKey = this.bg ? ['bg', 'background', this.bg] : ['ĸ', 'color', this.color];
      const color = changeKey[2];
      key = `${changeKey[0]}${color}${this._raisedState}${this.elevation}`;

      /** Create style */
      newClassName = this.theme.setStyle(`ly-${key}`, () => {
        const _color = this.theme.colorOf(this.bg || this.color);
        let styles = `${changeKey[1]}:${_color};`;
        if (this._raisedState) {
          styles += shadowBuilder(this.elevation, _color);
        }
        return styles;
      });

    } else {
      key = `raised${this._raisedState}${this.elevation}`;
      newClassName = this.theme.setStyle(`ly-${key}`, () => {
        if (this._raisedState) {
          return shadowBuilder(this.elevation, this.theme.palette.colorShadow);
        } else {
          return shadowBuilder(0, this.theme.palette.colorShadow);
        }
      });
    }
    this.theme.updateClassName(this.elementRef.nativeElement, this.renderer, newClassName, this._currentClassName);
    this._currentClassName = newClassName;
  }
  private contrastStyle() {
    const cssBg = this.theme.colorOf(this.bg);
    this._color = this.theme.colorOf(`${this.bg}:contrast`);
    let styles = `background:${cssBg};color:${this._color};`;
    if (this._raisedState) {
      styles += shadowBuilder(this.elevation, cssBg);
    }
    return styles;
  }

  private bgColorStyle() {
    const cssBg = this.theme.colorOf(this.bg);
    const cssColor = this.theme.colorOf(this.color);
    let styles = `background:${cssBg};color:${cssColor};`;
    if (this._raisedState) {
      styles += shadowBuilder(this.elevation, cssBg);
    }
    return styles;
  }
}
