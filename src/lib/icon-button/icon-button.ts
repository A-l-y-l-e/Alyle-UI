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

import { LyRippleModule, LyRipple } from 'alyle-ui/ripple';

@Directive({selector: '[s_f]'})
class RefState {
  constructor(public elementRef: ElementRef) {

  }
}

@Component({
  selector: '[ly-icon-button], ly-icon-button',
  styleUrls: ['icon-button.style.scss'],
  host: {
    '[style.width.px]': 'toNumber(size) * 2',
    '[style.height.px]': 'toNumber(size) * 2',
    '[style.line-height.px]': 'toNumber(size) * 2',
    '[style.font-size.px]': 'toNumber(size) / 2',
  },

  template: `
  <div class="ly-icon-button-container">
    <div [style.color]="color" [style.margin.px]="toNumber(size) / 2" [style.width]="size" [style.font-size]="size" [style.height]="size" ly-icon><ng-content></ng-content></div>
    <div [style.color]="color" #_lyRiple ly-ripple class="ly-icon-button-content" [ly-ripple-centered]="true" [ly-ripple-max-radius]="toNumber(_size)">
    </div>
  </div>
  `
})
export class LyIconButton implements OnInit, OnDestroy, AfterViewInit {
  // lySidenavId: string;
  // "ly-sidenav-id": string;
  // TypeScript private modifiers
  _isActiveDown = false;
  _isActiveFocus = false;

  refState = false;

  public _style: any;
  circular: any = document.createElement('span');
  timePress: any;
  _size: any = '24px';
  nativeElement: HTMLElement;
  @HostBinding('class.ly-ripple-no-focus') lyRippleNoFocus = false;
  @HostListener('mousedown') onClick() {
    this.lyRippleNoFocus = true;
  }
  @HostListener('blur') onBlur() {
    this.lyRippleNoFocus = false;
  }
  @HostListener('keydown') onKeydown() {
    this.lyRippleNoFocus = true;
  }
  @Input('size')
  set size(val) {
    // if (val !== this._size) {
      this._size = val;
    // }
  }
  get size() {
    // console.log(this._size);
    return this._size;
  }
  @Input('size.px')
  set sizePx(val) {
    if (val !== this._size) {
      this._size = `${val}px`;
    }
  }

  @Input('color') color = 'currentColor';
  @ViewChild('_lyRiple') ripple: LyRipple;
  @HostBinding('class.is-active') get _isActive(): boolean {
    return !(this._isActiveDown && this._isActiveFocus);
  }

  constructor(
    public elementRef: ElementRef,
   ) {
     this.elementRef.nativeElement.tabIndex = 0;
     this.nativeElement = this.elementRef.nativeElement;
  }
  toNumber(num) {
    return parseFloat(num);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']) {
      this.setSize();
    }
  }
  ngOnInit() {
    this.setSize();
  }
  setSize(): void {
    // const el = document.createElement('div');
    // el.style.width = this.size;
    // el.style.height = this.size;
    // // console.warn('el', el);
    // document.body.appendChild(el);
    //
    // this._size = el.offsetWidth;
    // document.body.removeChild(el);
    // console.warn(this._size, this.size);
  }


  ngAfterViewInit() {
    this.ripple.addRippleEvents(this.elementRef.nativeElement);
  }

  ngAfterContentInit() {
    this.setSize();
    // console.log((this.ref_.elementRef.nativeElement));
    /*if (this._lref !== undefined) {
      this.refState = true;
    } else {
      this.elementRef.nativeElement.setAttribute('tabindex', 0);
      this.elementRef.nativeElement.setAttribute('role', 'button');
    }*/
  }
  ngOnDestroy() {
    this.ripple.removeRippleEvents(this.elementRef.nativeElement);
  }
}

const LY_ICON_BUTTON = [LyIconButton];
@NgModule({
  imports: [CommonModule, LyRippleModule],
  exports: [LyIconButton],
  declarations: [LyIconButton],
})
export class LyIconButtonModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: LyIconButtonModule};
  }
}
