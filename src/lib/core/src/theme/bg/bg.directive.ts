import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  Optional
  } from '@angular/core';

import { LyTheme, StyleData } from '../../theme.service';
import { LyColor } from '../color/color.directive';

/**
 * for all except ly-button
 */
@Directive({
  selector: `
  :not([ly-button]):not([color="auto"])[bg],
  :not([color="auto"])[color][bg]
  `
})
export class LyBg {
  /** Default bg */
  private _bg = 'primary';
  private _currentStyleData: StyleData;
  private prefix = 'bg';
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  @Input('bg')
  set bg(color: string) {
    this._bg = color;
    const key = `${this.prefix}${color || this._bg}`;
    const newStyleData = this.theme.createStyle(`ly-${key}`, this.css.bind(this), color);
    this.theme.updateClass(this.elementRef, this.renderer, newStyleData, this._currentStyleData);
    this._currentStyleData = newStyleData;
  }

  get bg() {
    return this._bg;
  }

  css(bg: string) {
    return `background:${this.theme.colorOf(bg)};`;
  }
}

@Directive({
  selector: `
  [bg][ly-button]:not([color]),` + // for ly-button
  `[color="auto"]` // for any with [color="auto"]
})
export class LyBgContrastTex {
  /** Default bg */
  private _bg = 'primary';
  private _currentStyleData: StyleData;
  private prefix = 'bgC';
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Optional() private color: LyColor
  ) { }

  @Input('bg')
  set bg(color: string) {
    this._bg = color;
    const key = `${this.prefix}${color || this._bg}`;
    const newStyleData = this.theme.createStyle(`ly-${key}`, this.css.bind(this), color);
    this.theme.updateClass(this.elementRef, this.renderer, newStyleData, this._currentStyleData);
    this._currentStyleData = newStyleData;
  }

  get bg() {
    return this._bg;
  }

  css(bg: string) {
    const color = this.theme.colorOf(bg);
    return `background:${color};color:${this.theme.colorOf(`${bg}:contrast`)
    }`;
  }
}
