import {
  Directive,
  Input,
  ElementRef,
  HostBinding,
  Renderer2
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LyShadowService } from './shadow.service';
import { LyTheme, shadowBuilder, toBoolean, StyleData } from '@alyle/ui';

@Directive({
  selector: '[ly-deep], [ly-shadow], [lyShadow]'
})
export class LyDeepComponent {
  private _size = 1;
  private _interval = 3000;
  private _result: string;
  private numberState = -1;
  private _shadowColor = 'rgba(0,0,0,0.87)';
  private _currentStyleData: StyleData;
  /** Default elevation */
  private elevation: string | number = 1;
  @HostBinding('style.box-shadow') styleBoxShadow: SafeStyle | string;
  @Input()
  set lyShadow(val: string[]) {
    this.shadow.setShadow(this.elementRef, this.renderer, val, this._currentStyleData);
  }

  @Input('shadowColor')
  set shadowColor(val: string) {
    this._shadowColor = this.theme.colorOf(val);
    this.styleHost();
  }
  get shadowColor() {
    return this._shadowColor;
  }
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme,
    private shadow: LyShadowService
  ) { }

  public styleHost() {
    this.styleBoxShadow = this.shadow.shadow(this.shadowColor, this.scale);
  }

  @Input()
  public get scale(): number {
    return this._size;
  }

  public set scale(val: number) {
    this._size = val;
    this.styleHost();
  }
}
