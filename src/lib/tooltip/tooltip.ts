import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  OnInit,
  Renderer2,
  InjectionToken,
  Optional,
  Inject
  } from '@angular/core';
import {
  LyFocusState,
  LyOverlay,
  LyTheme2,
  OverlayFactory,
  Placement,
  ThemeVariables,
  XPosition,
  YPosition,
  Positioning,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  ThemeRef
  } from '@alyle/ui';
import { Subscription } from 'rxjs';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';

/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({passive: true});

export interface LyTooltipDefaultOptions {
  /** Default delay when the tooltip is shown. */
  showDelay: number;

  /** Default delay when the tooltip is hidden. */
  hideDelay: number;

  /** Default delay when hiding the tooltip on a touch device. */
  touchendHideDelay: number;
}

export const LY_TOOLTIP_DEFAULT_OPTIONS =
  new InjectionToken<LyTooltipDefaultOptions>('LY_TOOLTIP_DEFAULT_OPTIONS');

/** Possible positions for a tooltip. */
export type LyTooltipPosition = 'left' | 'right' | 'above' | 'below' | 'before' | 'after';

export interface LyTooltipTheme {
  /** Styles for Tooltip Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyTooltipVariables {
  tooltip?: LyTooltipTheme;
}

const DEFAULT_PLACEMENT = YPosition.below;
const STYLE_PRIORITY = -2;
export const STYLES = (theme: ThemeVariables & LyTooltipVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    root: () => (theme.tooltip
      && theme.tooltip.root
      && (theme.tooltip.root instanceof StyleCollection
        ? theme.tooltip.root.setTransformer(fn => fn(__)).css
        : theme.tooltip.root(__))
    )
  };
};

@Directive({
  selector: '[lyTooltip]',
  exportAs: 'lyTooltip'
})
export class LyTooltip implements OnInit, OnDestroy {
  /** @docs-private */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  private _tooltip: string | TemplateRef<any> | null;
  private _tooltipOverlay: OverlayFactory | null;
  private _listeners: (readonly [string, EventListenerOrEventListenerObject])[] = [];
  private _scrollSub: Subscription;
  private _scrollVal = 0;
  private _showTimeoutId: number | null;
  private _hideTimeoutId: number | null;
  @Input('lyTooltip')
  set tooltip(val: string | TemplateRef<any> | null) {
    this._tooltip = val;
  }
  get tooltip() {
    return this._tooltip;
  }

  @Input('lyTooltipShowDelay')
  get showDelay(): number {
    return this._showDelay;
  }
  set showDelay(value: NumberInput) {
    this._showDelay = coerceNumberProperty(value);
  }
  private _showDelay = this._defaults?.showDelay ?? 0;

  @Input('lyTooltipHideDelay')
  get hideDelay(): number {
    return this._hideDelay;
  }
  set hideDelay(value: NumberInput) {
    this._hideDelay = coerceNumberProperty(value);
  }
  private _hideDelay = this._defaults?.hideDelay ?? 0;


  @Input('lyTooltipPlacement') placement: Placement;
  @Input('lyTooltipXPosition') xPosition: XPosition;
  @Input('lyTooltipYPosition') yPosition: YPosition;
  constructor(
    private _theme: LyTheme2,
    private _overlay: LyOverlay,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    private _focusState: LyFocusState,
    @Optional() @Inject(LY_TOOLTIP_DEFAULT_OPTIONS)
    private _defaults: LyTooltipDefaultOptions,
    ngZone: NgZone,
    scroll: ScrollDispatcher,
    private _platform: Platform,
  ) {
    if (_platform.isBrowser) {
      const element: HTMLElement = _el.nativeElement;
      if (this._platformSupportsMouseEvents()) {
        this._listeners.push(['mouseenter', () => this.show()]);
        this._listeners.push(['mouseleave', () => this.hide()]);
      } else {
        this._listeners.push(['touchstart', () => this.show()]);
        this._listeners.push(['touchend', () => this.hide(this._defaults?.touchendHideDelay ?? 1500)]);
        this._listeners.push(['touchcancel', () => this.hide(this._defaults?.touchendHideDelay ?? 1500)]);
      }

      this._addListeners(this._listeners);

      this._scrollSub = scroll.scrolled().subscribe(() => {
        if (this._tooltipOverlay) {
          this._scrollVal++;
          if (this._scrollVal > 15) {
            ngZone.run(() => this.hide(0));
            this._scrollVal = 0;
          }
        }
      });

      _focusState.listen(element)!.subscribe(ev => {
        if (ev === 'keyboard') {
          ngZone.run(() => this.show());
        } else if (ev == null) {
          ngZone.run(() => this.hide());
        }
      });
    }
  }

  ngOnInit() {
    if (!this.placement && !this.xPosition && !this.yPosition) {
      this.placement = DEFAULT_PLACEMENT;
    }
  }

  ngOnDestroy() {
    this.hide(0);

    // Clean up the event listeners set in the constructor
    this._listeners.forEach(([event, listener]) => {
      this._el.nativeElement.removeEventListener(event, listener, passiveListenerOptions);
    });
    this._listeners.length = 0;

    if (this._scrollSub) {
      this._scrollSub.unsubscribe();
    }

    this._focusState.unlisten(this._el);
  }

  show(delay = this.showDelay) {
    if (this._hideTimeoutId) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = null;
    }
    if (!this._platformSupportsMouseEvents()) {
      this._updatePosition();
    }
    if (!this._tooltipOverlay && this.tooltip && !this._showTimeoutId) {
      const tooltipRef = this.tooltip;
      this._showTimeoutId = setTimeout(() => {
        // const rect = this._el.nativeElement.getBoundingClientRect();
        const tooltip = this._tooltipOverlay = this._overlay.create(tooltipRef, undefined, {
          styles: {
            // top: rect.y,
            // left: rect.x
          },
          onResizeScroll: this._updatePosition.bind(this),
          classes: [
            this.classes.root,
            this._theme.addStyle('LyTooltip', (theme: ThemeVariables) => ({
              borderRadius: '4px',
              fontSize: '10px',
              padding: '6px 8px',
              opacity: 0,
              transition: `opacity ${theme.animations.curves.standard} 300ms`,
              left: 0,
              margin: '8px',
              pointerEvents: 'all',
              [theme.getBreakpoint('XSmall')]: {
                padding: '8px 16px',
                fontSize: '14px',
              }
            }), undefined, undefined, STYLE_PRIORITY)
          ],
          hasBackdrop: false
        });
        this._updatePosition();

        this._theme.requestAnimationFrame(() => {
          this._theme.addStyle('lyTooltip:open', ({
            opacity: 1,
          }), tooltip.containerElement, undefined, STYLE_PRIORITY);
        });

        this._showTimeoutId = null;
        this._markForCheck();
      }, delay) as any;
    }
  }

  hide(delay = this.hideDelay) {
    const tooltipOverlay = this._tooltipOverlay;
    if (this._showTimeoutId) {
      clearTimeout(this._showTimeoutId);
      this._showTimeoutId = null;
    }
    if (!this._platformSupportsMouseEvents()) {
      this._updatePosition();
    }
    if (tooltipOverlay && !this._hideTimeoutId) {
      this._hideTimeoutId = setTimeout(() => {
        this._renderer.removeClass(tooltipOverlay.containerElement, this._theme.addStyle('lyTooltip:open', null));
        setTimeout(() => tooltipOverlay.destroy(), 300);
        this._tooltipOverlay = null;

        this._hideTimeoutId = null;
        this._markForCheck();
      }, delay) as any;
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

  private _updatePosition() {
    const tooltip = this._tooltipOverlay;
    if (tooltip) {
      const position = new Positioning(
        this.placement, this.xPosition,
        this.yPosition,
        this._el.nativeElement,
        tooltip.containerElement,
        this._theme.variables,
        13
      );
      tooltip.containerElement.style.transform = `translate3d(${position.x}px,${position.y}px,0)`;
    }
  }

  private _addListeners(listeners: (readonly [string, EventListenerOrEventListenerObject])[]) {
    listeners.forEach(([event, listener]) => {
      this._el.nativeElement.addEventListener(event, listener, passiveListenerOptions);
    });
  }

  private _platformSupportsMouseEvents() {
    return !this._platform.IOS && !this._platform.ANDROID;
  }
}
