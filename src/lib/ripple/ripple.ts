import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Output,
  Directive,
  SimpleChange,
  OnChanges,
  ModuleWithProviders,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  NgZone,
  OnDestroy,
  Optional,
  HostBinding,
  HostListener
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { LyPalette } from '../core/palette';
// import { Log } from '../core';
export const LY_RIPPLE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyRipple),
  multi: true
};
import { LyPalette } from '../core';

@Directive({
  selector: '[ly-ripple-sensitive]'
})
export class LyRippleSensitive {
  private _state = true;
  @Input('ly-ripple-sensitive')
  set state(value: boolean) {
    if (value === false) {
      this._state = false;
    } else {
      this._state = true;
    }
  }
  get state(): boolean {
    return this._state;
  };
}

@Directive({
  selector: '[ly-ripple-trigger-for]',
  exportAs: 'LyRippleTriggerFor'
})
export class LyRippleTriggerFor implements AfterViewInit, OnDestroy {
  @Input('ly-ripple-trigger-for') ripple: LyRipple;

  constructor(
    private elementRef: ElementRef,
    private _ngZone: NgZone
  ) { }

  ngAfterViewInit() {
    this.ripple.addRippleEvents(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.ripple.removeRippleEvents(this.elementRef.nativeElement);
  }

}

@Component({
  selector: '[ly-ripple]',
  styleUrls: ['ripple.scss'],
  providers: [LY_RIPPLE_CONTROL_VALUE_ACCESSOR],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyRipple implements OnDestroy, AfterViewInit {
  private rippleElement: HTMLElement;
  private timeRipple = 0;
  duration: number = 375 * 2;
  @Input('ly-ripple-centered') centered: boolean;
  @Input('ly-ripple-max-radius') maxRadius = 0;
  @Input('ly-ripple-disabled') disabled: boolean;
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
  private _eventHandlers: Map<string, (e: Event) => void>;
  private _hoverContainer: HTMLElement;
  _containerRect: ClientRect;

  constructor(
    private elementRef: ElementRef,
    private _ngZone: NgZone,
    @Optional() public sensitive: LyRippleSensitive
  ) {

  }

  private _updateHoverContainer() {
    this._containerRect = this._getContainerRect();
    const sizeMax = Math.max(this.containerRect.height, this.containerRect.width);
    this._hoverContainer.style.width = `${sizeMax}px`;
    this._hoverContainer.style.height = `${sizeMax}px`;
    this._hoverContainer.style.top = `${this.containerRect.height / 2 - sizeMax / 2}px`;
    this._hoverContainer.style.left = `${this.containerRect.width / 2 - sizeMax / 2}px`;
  }
  ngAfterViewInit() {
    const hoverContainer = document.createElement('ly-hover-container');
    this._hoverContainer = this.elementRef.nativeElement.appendChild(hoverContainer);
    this._updateHoverContainer();
    const eventHandlers = new Map<string, (e: Event) => void>();
    if (!this.disabled) {
      /**
       * touch event
       */
      eventHandlers.set('mousedown', (event: MouseEvent) => this._handleMouseDown(event));
      eventHandlers.set('keydown', (event: KeyboardEvent) => this._handleMouseDown(event));
      eventHandlers.set('keyup', (event: KeyboardEvent) => this._removeRipple());
      eventHandlers.set('mouseleave', (event: MouseEvent) => this._handleMouseup());
      eventHandlers.set('mouseup', (event: MouseEvent) => this._handleMouseup());
      this._eventHandlers = eventHandlers;
      this.addRippleEvents(this.elementRef.nativeElement);
    } else {
      this._eventHandlers = eventHandlers;
    }
  }
  ngOnDestroy() {
    this.removeRippleEvents(this.elementRef.nativeElement);
  };
  addRippleEvents(element: any) {
    this._ngZone.runOutsideAngular(() => {
      this._eventHandlers.forEach((eventHandler, eventName) => {
        element.addEventListener(eventName, eventHandler);
      });
    });
  }
  removeRippleEvents(element: any) {
    this._eventHandlers.forEach((eventHandler, eventName) => {
      element.removeEventListener(eventName, eventHandler);
    });
  }
  private get _getSize() {
    return {
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight,
    };
  }
  private get _getoffset() {
    return offset(this.elementRef.nativeElement);
  }
  private _removeRipple() {
    this._handleMouseup();
  }

  private _updateTimeRipple() {
    this.timeRipple = Date.now();
  }

  /**
   * end ripple
   */
  public _handleMouseup() {
    const r = 0;
    this.timeRipple = Date.now() - this.timeRipple;
    const e: HTMLElement = this.rippleElement;
    if (this.timeRipple <= 300 && this.timeRipple != 0) {
      this._ngZone.runOutsideAngular(() => {
        if (this.rippleElement) {
          this.rippleElement = null;
          window.setTimeout(() => {
            e.style.opacity = '0';
            window.setTimeout(() => {
              e.remove();
            }, this.duration);
          }, 320);
        }
      });
    } else {
      this._ngZone.runOutsideAngular(() => {
        if (this.rippleElement) {
          this.rippleElement = null;
          e.style.opacity = '0';
          window.setTimeout(() => {
            e.remove();
          }, this.duration);
        }
      });
    }
    this.timeRipple = 0;
  }
  KeyDownState(event: KeyboardEvent): boolean {
    let state = false;
    if (
      event.type === 'keydown' &&
      !!(event.keyCode === 13 ||
      event.keyCode === 32) &&
      !(event.repeat)
    ) {
      state = true;
    }
    return state;
  }

  get containerRect(): ClientRect {
    return this._containerRect;
  }
  private _getContainerRect(): ClientRect {
    const pr = this.elementRef.nativeElement;
    return pr.getBoundingClientRect() as ClientRect;
  }

  private _rippleActionState(e: any, el: HTMLElement): boolean {
    if (this.sensitive) {
      if (
        !((e).target.clientWidth === el.clientWidth &&
        (e).target.clientHeight === el.clientHeight) &&
        !this.sensitive.state
      ) {
        return true;
      }
    } else if (!((e).target.clientWidth === el.clientWidth &&
    (e).target.clientHeight === el.clientHeight)) {
      return true;
    }
    return false;
  }


  public _handleMouseDown(e: any) {
    const pr = this.elementRef.nativeElement;
    if (this._rippleActionState(e, pr)) {
      return;
    }

    this.timeRipple = Date.now();
    const rippleElement: HTMLElement = document.createElement('div');
    const containerRect = this._getContainerRect();
    this._updateHoverContainer();
    this._containerRect = containerRect;
    let _styleTop = 0;
    let _styleLeft = 0;
    let sizeRipple = 0;
    if (this.centered) {
      rippleElement.className = 'ly-ripple-element ly-center-ripple';
    } else {
      rippleElement.className = 'ly-ripple-element';
    }
    if (this.KeyDownState(e)) {
      this._removeRipple();
      sizeRipple = containerRect.width;
      _styleTop = -1 * (sizeRipple / 2 - (containerRect.height / 2));
      // rippleElement.className = 'ly-ripple-element';
    } else if (e.type !== 'keydown') {
      this._removeRipple();
      // this.timeRipple = Date.now();
      const psX = e.clientX;
      const psY = e.clientY;
      const TOP = (psY - this._getoffset.top);
      const LEFT = (psX - this._getoffset.left);
      let distancefromV = 10;
      let distancefromH = 10;
      if ((LEFT) < (containerRect.width / 2)) {
        distancefromV = (containerRect.width - (LEFT));
      } else {
        distancefromV = LEFT;
      }
      if ((TOP) < (containerRect.height / 2)) {
        distancefromH = (containerRect.height - (TOP));
      } else {
        distancefromH = TOP;
      }

      if (this.centered) {
        // rippleElement.className = 'ly-ripple-element ly-center-ripple';
        distancefromV = containerRect.width / 2;
        distancefromH = containerRect.height / 2;
      } else {
        // rippleElement.className = 'ly-ripple-element';
      }
      if (this.maxRadius != 0) {
        // distancefromV = this.maxRadius / 2;
        // distancefromH = this.maxRadius / 2;
        sizeRipple = this.maxRadius * 2;
      } else {
        sizeRipple = ((distancefromV * distancefromV) + (distancefromH * distancefromH));
        sizeRipple = Math.sqrt(sizeRipple) * 2;
      }

      _styleTop = this.centered === true ? distancefromV - sizeRipple / 2 : (TOP) - (sizeRipple / 2);
      _styleLeft = this.centered === true ? distancefromH - sizeRipple / 2 : (LEFT) - (sizeRipple / 2);
    } else {
      return;
    }
    this._updateTimeRipple();

    rippleElement.setAttribute('style', `
    top: ${_styleTop}px;
    left: ${_styleLeft}px;
    opacity: 0.1;
    width: ${sizeRipple}px;
    height: ${sizeRipple}px;
    transition: transform cubic-bezier(0.45, 0, 0.25, 1) ${
      this.duration
    }ms, opacity ease ${ this.duration }ms;
    `);

    this.rippleElement = this.elementRef.nativeElement.appendChild(rippleElement);
    this._ngZone.runOutsideAngular(() => {
      void rippleElement.offsetWidth;
      // rippleElement.offsetWidth = rippleElement.offsetWidth;
      // window.setTimeout(() => {
      if (this.centered) {
        rippleElement.style.opacity = '0.33';
      } else {
        rippleElement.style.opacity = '0.13';
      }
      rippleElement.style.transform = 'scale3d(1,1,1)';
      rippleElement.style.webkitTransform = 'scale3d(1,1,1)';
      // }, 0);
    });
  };

}

// Find exact position of element
   function isWindow(obj: any) {
       return obj !== null && obj === obj.window;
   }

   function getWindow(elem: any) {
       return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
   }

   function offset(elem: any) {
       let docElem: any, win: any,
           box = {top: 0, left: 0},
           doc = elem && elem.ownerDocument;

       docElem = doc.documentElement;

       if (typeof elem.getBoundingClientRect !== typeof undefined) {
           box = elem.getBoundingClientRect();
       }
       win = getWindow(doc);
       return {
           top: box.top + win.pageYOffset - docElem.clientTop,
           left: box.left + win.pageXOffset - docElem.clientLeft
       };
   }

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [LyRipple, LyRippleTriggerFor, LyRippleSensitive],
  declarations: [LyRipple, LyRippleTriggerFor, LyRippleSensitive],
})
export class LyRippleModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: LyRippleModule};
  }

}
