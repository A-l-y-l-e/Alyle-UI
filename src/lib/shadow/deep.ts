import {
  Component,
  ContentChildren,
  Directive,
  Input,
  QueryList,
  NgModule,
  ModuleWithProviders,
  ElementRef,
  ViewContainerRef,
  HostBinding
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LyShadowService } from './shadow.service';
import { toPositiveNumber } from './toPositiveNumber';
import { LyTheme } from 'alyle-ui/core';

@Directive({
  selector: '[ly-deep], [ly-shadow]',
})
export class LyDeepComponent {
  private _size = 1;
  private _interval = 3000;
  private _result: string;
  private numberState = -1;
  private _shadowColor = 'rgba(0,0,0,0.87)';
  @HostBinding('style.box-shadow') styleBoxShadow: SafeStyle | string;
  @Input('shadowColor')
  set shadowColor(val: string) {
    console.log({val});
    this._shadowColor = this.theme.colorOf(val);
    this.styleHost();
  }
  get shadowColor() {
    return this._shadowColor;
  }
  constructor(
    private elementRef: ElementRef,
    private shadow: LyShadowService,
    private theme: LyTheme
  ) {

  }
  public styleHost() {
    this.styleBoxShadow = this.shadow.shadow(this.shadowColor, this.scale);
  }

  @Input()
  public get scale(): number {
    return this._size;
  }
  public set scale(val: number) {
    this._size = val;
    // this.numberState = val >= 0 ? 1 : -1;
    // if (this.numberState === -1) {
    //   this._size = val * -1;
    // } else {
    //   this._size = val;
    // }
    this.styleHost();
  }
}
