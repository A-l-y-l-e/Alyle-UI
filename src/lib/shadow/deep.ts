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
  HostBinding,
  OnInit,
  Renderer2
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LyShadowService } from './shadow.service';
import { LyTheme, shadowBuilder, toBoolean } from 'alyle-ui/core';

@Directive({
  selector: '[ly-deep], [ly-shadow], [lyShadow]'
})
export class LyDeepComponent implements OnInit {
  private _size = 1;
  private _interval = 3000;
  private _result: string;
  private numberState = -1;
  private _shadowColor = 'rgba(0,0,0,0.87)';
  private _lastClass: string;
  /** Default elevation */
  private elevation: string | number = 1;
  @HostBinding('style.box-shadow') styleBoxShadow: SafeStyle | string;
  @Input()
  set lyShadow(val: string[]) {
    let keys: string;
    let elevation: string | number;
    let color: string;
    if (val) {
      keys = val.join();
      elevation = val[0];
      color = val[1];
    } else {
      keys = `${this.elevation}`;
      elevation = this.elevation;
    }
    const newStyle = this.theme.createStyle(`ly-${keys}`, this.css.bind(this), elevation, color);
    this.theme.updateRootClass(this.elementRef, this.renderer, newStyle.id, this._lastClass);
    this._lastClass = keys;
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

  ngOnInit() {
    // console.log('slect', this.styleSheet.existStyle(''));
  }

  public styleHost() {
    this.styleBoxShadow = this.shadow.shadow(this.shadowColor, this.scale);
  }

  css(elevation: string | number, color: string = '') {
    return `${shadowBuilder(elevation, this.theme.colorOf(color))}`;
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
