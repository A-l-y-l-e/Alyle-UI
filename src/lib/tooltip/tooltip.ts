import { Directive, Input, TemplateRef, OnDestroy, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { LyTheme2, LY_COMMON_STYLES, LyOverlay, OverlayFromTemplateRef, Platform, LyFocusState, ThemeVariables, WindowScrollService } from '@alyle/ui';
import { Subscription } from 'rxjs';

const STYLE_PRIORITY = -2;
const styles = ({
  root: {
    ...LY_COMMON_STYLES.fill
  }
});

@Directive({
  selector: '[lyTooltip]',
  exportAs: 'lyTooltip'
})
export class LyTooltip implements OnDestroy {
  readonly classes = this._theme.addStyleSheet(styles, STYLE_PRIORITY);
  private _tooltip: string | TemplateRef<any> | null;
  private _tooltipOverlay: OverlayFromTemplateRef;
  private _listeners = new Map<string, EventListenerOrEventListenerObject>();
  private _scrollSub: Subscription;
  // private _scrollVal = 0;
  private _showTimeoutId: number | null;
  private _hideTimeoutId: number | null;
  @Input('lyTooltip')
  set tooltip(val: string | TemplateRef<any>) {
    this._tooltip = val;
  }
  get tooltip() {
    return this._tooltip;
  }
  @Input() lyTooltipShowDelay: number = 0;
  @Input() lyTooltipHideDelay: number = 0;
  constructor(
    private _theme: LyTheme2,
    private _overlay: LyOverlay,
    private _el: ElementRef,
    private _cd: ChangeDetectorRef,
    focusState: LyFocusState,
    ngZone: NgZone,
    scroll: WindowScrollService
  ) {
    if (Platform.isBrowser) {
      const element: HTMLElement = _el.nativeElement;
      if (!Platform.IOS && !Platform.ANDROID) {
        this._listeners
          .set('mouseenter', () => this.show())
          .set('mouseleave', () => this.hide());
      } else {
        this._listeners.set('touchstart', () => this.show());
      }

      this._listeners.forEach((listener, event) => element.addEventListener(event, listener));

      this._scrollSub = scroll.scroll$.subscribe(() => {
        if (this._tooltipOverlay) {
          // this._scrollVal++;
          // if (this._scrollVal > 10) {
            ngZone.run(() => this.hide(0));
            // this._scrollVal = 0;
          // }
        }
      });

      focusState.listen(element).subscribe(ev => {
        if (ev.by === 'keyboard' && ev.event.type === 'focus') {
          ngZone.run(() => this.show());
        } else if (ev.event.type === 'blur') {
          ngZone.run(() => this.hide());
        }
      });
    }
  }

  ngOnDestroy() {
    this.hide(0);

    // Clean up the event listeners set in the constructor
    this._listeners.forEach((listener, event) => {
      this._el.nativeElement.removeEventListener(event, listener);
    });

    if (this._scrollSub) {
      this._scrollSub.unsubscribe();
    }
  }

  show(delay?: number) {
    delay = typeof delay === 'number' ? delay : this.lyTooltipShowDelay;
    if (this._hideTimeoutId) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = null;
    }
    if (!this._tooltipOverlay && this.tooltip && !this._showTimeoutId) {

      this._showTimeoutId = <any>setTimeout(() => {
        const rect = this._el.nativeElement.getBoundingClientRect();
        const tooltip = this._tooltipOverlay = this._overlay.create(this.tooltip, undefined, {
          styles: {
            top: rect.y,
            left: rect.x,
            pointerEvents: null
          },
          classes: [
            this._theme.addStyle('LyTooltip', (theme: ThemeVariables) => ({
              borderRadius: '4px',
              ...theme.tooltip.root,
              fontSize: '10px',
              padding: '6px 8px',
              [theme.getBreakpoint('XSmall')]: {
                padding: '8px 16px',
                fontSize: '14px',
              }
            }))
          ]
        });
        const tooltipRect = tooltip.containerElement.getBoundingClientRect();
        tooltip.containerElement.style.transform = `translate3d(${Math.round(rect.width / 2 - tooltipRect.width / 2)}px,${Math.round(rect.height * .2 + rect.height)}px,0px)`;

        this._showTimeoutId = null;
        this._markForCheck();
      }, delay);
    }
  }

  hide(delay?: number) {
    const tooltipOverlay = this._tooltipOverlay;
    delay = typeof delay === 'number' ? delay : this.lyTooltipHideDelay;
    if (this._showTimeoutId) {
      clearTimeout(this._showTimeoutId);
      this._showTimeoutId = null;
    }
    if (tooltipOverlay && !this._hideTimeoutId) {

      this._hideTimeoutId = <any>setTimeout(() => {
        tooltipOverlay.destroy();
        this._tooltipOverlay = null;

        this._hideTimeoutId = null;
        this._markForCheck();
      }, delay);
    }
  }

  toggle() {
    if (this._tooltipOverlay) {
      this.hide();
    } else {
      this.show();
    }
  }

  private _markForCheck() {
    this._cd.markForCheck();
  }
}
