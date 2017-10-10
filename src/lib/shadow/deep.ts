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
  private _size: number = 1;
  private _interval: number = 3000;
  private _result: string;
  private numberState: number = -1;
  private _shadowColor: string;
  @HostBinding('style.box-shadow') styleBoxShadow: SafeStyle | string;
  @Input('shadowColor')
  set shadowColor(val: string) {
    this._shadowColor = this.theme.color(val);
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
    // let style = `rgba(0, 0, 0, ${
    //   ((60 / 100) * Number('0.' + String(this._size)))
    // }) 0px ${
    //   ((3 * this._size) - 2) / 3 * this.numberState
    // }px ${
    //   (3 * this._size * 2)
    // }px 0px${
    //   ','
    // } rgba(0, 0, 0, ${
    //   (40 / 100) * Number('0.' + String(this._size))
    // }) 0px ${
    //   (((3 * this._size) - 2)) * this.numberState
    // }px ${(3 * this._size * 2) / 2}px 0px`;
    // if (this._size < 2 && this._size > 0) {
    //   style = style + `, rgba(0, 0, 0, 0.12) 0px ${2 * this.numberState}px 6px 0px`;
    // }
    // this.elementRef.nativeElement.style.boxShadow = style;
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
