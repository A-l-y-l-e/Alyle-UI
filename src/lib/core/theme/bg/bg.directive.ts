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
  /** Default */
  private _bg = 'primary';
  private _currentClassName: string;
  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  @Input('bg')
  set bg(color: string) {
    this._bg = color;
    const newClassName = this.theme.getClassKey(this._bg, 'bg');
    this.renderer.addClass(this.el.nativeElement, newClassName);
    this.renderer.removeClass(this.el.nativeElement, this._currentClassName);
    this._currentClassName = newClassName;
  }

  get bg() {
    return this._bg;
  }

}
