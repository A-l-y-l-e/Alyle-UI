import {
  NgModule,
  Component,
  ElementRef,
  Input,
  Directive,
  ModuleWithProviders,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostBinding,
  HostListener,
  isDevMode,
  Optional,
  Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyRippleModule, LyRipple } from '@alyle/ui/ripple';
import { Platform, LyBgColorAndRaised } from '@alyle/ui';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LyIconButtonService } from './icon-button.service';

@Component({
  selector: 'button[ly-icon-button], a[ly-icon-button], span[ly-icon-button]',
  template: `
  <div class="{{ iconButtonService.classes.content }}" [ngStyle]="iconStyle"
  lyRipple
  lyRippleSensitive
  lyRippleCentered
  lyRippleRadius="containerSize"
  >
    <ng-content></ng-content>
  </div>
  `,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lyIconButton'
})
export class LyIconButton implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private _size = '24px';
  nativeElement: HTMLElement;
  private _iconStyle: {[key: string]: string | number};
  @ViewChild(LyRipple) ripple: LyRipple;

  @Input('size')
  set size(val) {
    if (typeof val === 'number') {
      this._size = `${val}px`;
    } else {
      this._size = val;
    }
    this._updateSize();
  }
  get size() {
    return this._size;
  }

  @Input()
  set iconStyle(style) {
    this.assignStyle(style);
  }

  get iconStyle() {
    return this._iconStyle;
  }

  constructor(
    public elementRef: ElementRef,
    renderer: Renderer2,
    @Optional() private bgAndColor: LyBgColorAndRaised,
    public iconButtonService: LyIconButtonService
  ) {
    renderer.addClass(elementRef.nativeElement, iconButtonService.classes.host);
    if (bgAndColor) {
      bgAndColor.setAutoContrast();
    }
    if (Platform.isBrowser) {
      this.nativeElement = this.elementRef.nativeElement;
    }
  }
  assignStyle(newStyle) {
    this._iconStyle = Object.assign(this.iconStyle || {}, newStyle);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // #
  }
  ngOnInit() {
    if (!this.iconStyle) {
      this._updateSize();
    }
  }
  private _updateSize() {
    const wh = `calc(${this._size} * 2)`;
    const style = {
      'width': wh,
      'height': wh,
      'font-size': this._size
    };
    this.assignStyle(style);
  }

  ngAfterViewInit() {
    if (Platform.isBrowser) {
      this.ripple.lyRippleDisabled = true;
      this.ripple.rippleContainer.setTriggerElement(this.nativeElement);
      this.ripple.rippleContainer.setContainerElement(this.nativeElement);
      this.ripple.lyRippleDisabled = false;
    }
  }
  ngOnDestroy() { }
}

