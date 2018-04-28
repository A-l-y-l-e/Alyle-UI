import { Directive, Input, OnChanges, SimpleChanges, Inject, Optional, Renderer2, ElementRef, Host, Self } from '@angular/core';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyTheme, StyleData } from '../theme.service';
import { SkipSelf } from '@angular/core';

@Directive({
  selector: '[bg], [color]'
})
export class LyBgAndColor implements OnChanges {
  private _currentStyleData: StyleData;
  @Input() bg: string;
  @Input() color: string;

  constructor(
    private theme: LyTheme,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(LY_GLOBAL_CONTRAST) @Optional() private contrast: boolean
  ) { }

  public setAutoContrast() {
    this.contrast = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    let key;
    let newStyleData;
    if ((this.contrast && !this.color || this.color === 'auto') && this.bg) {
      key = `contrast${this.bg}`;
      newStyleData = this.theme.createStyle(`ly-${key}`, this.contrastStyle.bind(this), this.bg);
    } else if (this.bg && this.color) {
      key = `b&ĸ${this.bg}${this.color}`;
      newStyleData = this.theme.createStyle(`ly-${key}`, this.bgColorStyle.bind(this), this.bg, this.color);
    } else {
      const changeKey = this.bg ? ['bg', 'background', this.bg] : ['ĸ', 'color', this.color];
      const color = changeKey[2];
      key = `${changeKey[0]}${color}`;
      newStyleData = this.theme.createStyle(`ly-${key}`, (_styleKey, _color: string) => {
        return `${_styleKey}:${this.theme.colorOf(_color)}`;
      }, changeKey[1], color);
    }
    this.theme.updateClass(this.elementRef, this.renderer, newStyleData, this._currentStyleData);
    this._currentStyleData = newStyleData;
  }
  private contrastStyle(bg: string) {
    const color = this.theme.colorOf(bg);
    return `background:${color};color:${this.theme.colorOf(`${bg}:contrast`)}`;
  }

  private bgColorStyle(bg: string, ĸøłør: string) {
    return `background:${this.theme.colorOf(bg)};color:${this.theme.colorOf(`${ĸøłør}`)}`;
  }
}
