import {
  Directive,
  ElementRef,
  Input,
  Renderer2
  } from '@angular/core';

import { LyTheme } from '../../theme.service';

@Directive({
  selector: '[color]'
})
export class LyColor {
  /** Default color */
  private _color = 'primary';
  private _lastClass: string;
  private prefix = 'color';
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  @Input('color')
  set color(color: string) {
    const key = `${this.prefix}${color || this._color}`;
    const newStyle = this.theme.createStyle(`ly-${key}`, this.css.bind(this), color);
    this.theme.updateRootClass(this.elementRef, this.renderer, newStyle.id, this._lastClass);
    this._lastClass = newStyle.id;
  }

  get color(): string {
    return this._color;
  }

  css(color: string) {
    return `color:${this.theme.colorOf(color)};`;
  }
}
