import {
  Directive,
  ElementRef,
  Input,
  Renderer2
  } from '@angular/core';

import { LyTheme } from '../../theme.service';

@Directive({
  selector: '[bg]'
})
export class LyBg {
  /** Default bg */
  private _bg = 'primary';
  private _lastClass: string;
  private prefix = 'bg';
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  @Input('bg')
  set bg(color: string) {
    const key = `${this.prefix}${color || this._bg}`;
    const newStyle = this.theme.createStyle(`ly-${key}`, this.css.bind(this), color);
    this.theme.updateRootClass(this.elementRef, this.renderer, newStyle.id, this._lastClass);
    this._lastClass = newStyle.id;
  }

  get bg() {
    return this._bg;
  }

  css(bg: string) {
    return `background:${this.theme.colorOf(bg)};`;
  }
}
