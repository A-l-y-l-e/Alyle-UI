import {
  Directive,
  ElementRef,
  Input,
  Renderer2
  } from '@angular/core';

import { LyTheme, StyleData } from '../../theme.service';

@Directive({
  selector: ':not([color="auto"])[color]'
})
export class LyColor {
  /** Default color */
  private _color = 'primary';
  private _currentStyleData: StyleData;
  private prefix = 'color';
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  @Input('color')
  set color(color: string) {
    this._color = color;
    const key = `${this.prefix}${color || this._color}`;
    const newStyleData = this.theme.createStyle(`ly-${key}`, this.css.bind(this), color);
    this.theme.updateClass(this.elementRef, this.renderer, newStyleData, this._currentStyleData);
    this._currentStyleData = newStyleData;
  }

  get color(): string {
    return this._color;
  }

  css(color: string) {
    return `color:${this.theme.colorOf(color)};`;
  }
}
