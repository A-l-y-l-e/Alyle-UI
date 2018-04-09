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
  /** Default */
  private _color = 'primary';
  private _currentClassName: string;
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  @Input('color')
  set color(color: string) {
    this._color = color;
    const newClassName = this.theme.getClassKey(this._color, 'color');
    this.renderer.addClass(this.el.nativeElement, newClassName);
    this.renderer.removeClass(this.el.nativeElement, this._currentClassName);
    this._currentClassName = newClassName;
  }
  get color(): string {
    return this._color;
  }

}

function existKey(palette: any, key: string[]) {
  let state = palette;
  key.forEach((name) => {
    state = state[name];
  });
  return !!state.default;
}

