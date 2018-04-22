import {
  Directive,
  ElementRef,
  Input,
  Renderer2
  } from '@angular/core';

import { LyTheme, StyleData } from '../../theme.service';

@Directive({
  selector: '[bg]'
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
