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
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyRippleModule, LyRipple } from 'alyle-ui/ripple-minimal';
import { Platform } from 'alyle-ui/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'button[ly-icon-button], a[ly-icon-button], ly-icon-button',
  styleUrls: ['icon-button.style.scss'],
  template: `
  <div class="ly-icon-button-content" [ngStyle]="iconStyle"
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
    public elementRef: ElementRef
  ) {
    if (Platform.isBrowser) {
      this.nativeElement = this.elementRef.nativeElement;
      if (this.nativeElement.nodeName.toLowerCase() === 'ly-icon-button') {
        console.log(`ly-icon-button:`, this.nativeElement, ` is deprecated instead use button[ly-icon-button]`);
      }
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

@NgModule({
  imports: [CommonModule, LyRippleModule],
  exports: [LyIconButton],
  declarations: [LyIconButton],
})
export class LyIconButtonModule { }
