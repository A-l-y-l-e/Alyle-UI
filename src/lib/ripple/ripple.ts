import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Directive,
  ModuleWithProviders,
  ChangeDetectionStrategy,
  NgZone,
  OnDestroy,
  Optional,
  HostBinding,
  HostListener,
  AfterViewInit,
  Inject
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnimationBuilder, trigger, state, animate, transition, style } from '@angular/animations';

export const LY_RIPPLE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyRipple),
  multi: true
};

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyRipple implements OnDestroy, AfterViewInit {
  private rippleElement: HTMLElement;
  private timeRipple = 0;
  duration: number = 375 * 1.8;
  @Input('ly-ripple-centered') centered: boolean;
  @Input('ly-ripple-max-radius') maxRadius = 0;
  @Input('ly-ripple-disabled') disabled: boolean;
  @HostBinding('class.ly-ripple-no-focus') lyRippleNoFocus = false;
  private _eventHandlers: Map<string, (e: Event) => void> = new Map<string, (e: Event) => void>();
  @HostListener('mousedown') onClick() {
    this.lyRippleNoFocus = true;
  }
  @HostListener('blur') onBlur() {
    this.lyRippleNoFocus = false;
  }
  @HostListener('keydown') onKeydown() {
    this.lyRippleNoFocus = true;
  }
  private _hoverContainer: HTMLElement;
  _containerRect: ClientRect;

  constructor(
    private elementRef: ElementRef,
    private _ngZone: NgZone,
    @Optional() public sensitive: LyRippleSensitive,
    private ab: AnimationBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.warn('DEPRECATED', elementRef);
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
    if (isPlatformBrowser(this.platformId)) {
      const hoverContainer = document.createElement('ly-hover-container');
      this._hoverContainer = this.elementRef.nativeElement.appendChild(hoverContainer);
      this._updateHoverContainer();
      if (!this.disabled) {
        this._eventHandlers.set('mousedown', (event: MouseEvent) => this._handleMouseDown(event));
        this._eventHandlers.set('keydown', (event: KeyboardEvent) => this._handleMouseDown(event));
        this._eventHandlers.set('keyup', (event: KeyboardEvent) => this._removeRipple());
        this._eventHandlers.set('mouseleave', (event: MouseEvent) => this._handleMouseup());
        this._eventHandlers.set('mouseup', (event: MouseEvent) => this._handleMouseup());
        this.addRippleEvents(this.elementRef.nativeElement);
      }
    }
  }
  ngOnDestroy() {
    this.removeRippleEvents(this.elementRef.nativeElement);
  }
  addRippleEvents(element: any) {
    if (isPlatformBrowser(this.platformId)) {
      this._ngZone.runOutsideAngular(() => {
        this._eventHandlers.forEach((eventHandler, eventName) => {
          element.addEventListener(eventName, eventHandler);
        });
      });
    }
  }
  removeRippleEvents(element: any) {
    if (isPlatformBrowser(this.platformId)) {
      this._eventHandlers.forEach((eventHandler, eventName) => {
        element.removeEventListener(eventName, eventHandler);
      });
    }
  }
  private get _getSize() {
    return {
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight,
    };
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
    if (this.timeRipple <= 300 && this.timeRipple !== 0) {
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
    let _state = false;
    if (
      event.type === 'keydown' &&
      !!(event.keyCode === 13 ||
      event.keyCode === 32) &&
      !(event.repeat)
    ) {
      _state = true;
    }
    return _state;
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
    const rippleElement: any = document.createElement('div');
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
      const TOP = (psY - containerRect.top);
      const LEFT = (psX - containerRect.left);
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
        distancefromV = containerRect.width / 2;
        distancefromH = containerRect.height / 2;
        sizeRipple = Math.max(sizeRipple, distancefromH);
      } else {
        if (this.maxRadius) {
          sizeRipple = this.maxRadius * 2;
          console.log('this.centered');
        } else {
          sizeRipple = ((distancefromV * distancefromV) + (distancefromH * distancefromH));
          sizeRipple = Math.sqrt(sizeRipple) * 2;
        }
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
    transition: transform cubic-bezier(0.4, 0.0, 0.2, 1) ${
      this.duration
    }ms, opacity ease ${ this.duration }ms;
    `);

    this.rippleElement = this.elementRef.nativeElement.appendChild(rippleElement);

    window.getComputedStyle(rippleElement).getPropertyValue('opacity');

    rippleElement.style.opacity = '0.17';
    rippleElement.style.transform = 'scale3d(1,1,1)';
    rippleElement.style.webkitTransform = 'scale3d(1,1,1)';
  }

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
