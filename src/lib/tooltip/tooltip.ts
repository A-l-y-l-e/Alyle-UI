import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  OnInit,
  Renderer2
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
import { Platform } from '@angular/cdk/platform';

export interface LyTooltipTheme {
  /** Styles for Tooltip Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
    | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
  appearance?: {
    icon?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    fab?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    miniFab?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    [name: string]: ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined
  };
  size?: {
    small?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    medium?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    large?: (classes: LyClasses<typeof STYLES>) => StyleTemplate
    [name: string]: ((classes: LyClasses<typeof STYLES>) => StyleTemplate) | undefined
  };
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
  private _listeners = new Map<string, EventListenerOrEventListenerObject>();
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
  @Input() lyTooltipShowDelay: number = 0;
  @Input() lyTooltipHideDelay: number = 0;
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
    ngZone: NgZone,
    scroll: ScrollDispatcher,
    platform: Platform
  ) {
    if (platform.isBrowser) {
      const element: HTMLElement = _el.nativeElement;
      if (!platform.IOS && !platform.ANDROID) {
        this._listeners
          .set('mouseenter', () => this.show())
          .set('mouseleave', () => this.hide());
      } else {
        this._listeners.set('touchstart', () => this.show());
      }

      this._listeners.forEach((listener, event) => element.addEventListener(event, listener));

      this._scrollSub = scroll.scrolled().subscribe(() => {
        if (this._tooltipOverlay) {
          this._scrollVal++;
          if (this._scrollVal > 10) {
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
    this._listeners.forEach((listener, event) => {
      this._el.nativeElement.removeEventListener(event, listener);
    });

    if (this._scrollSub) {
      this._scrollSub.unsubscribe();
    }

    this._focusState.unlisten(this._el);
  }

  show(delay?: number) {
    delay = typeof delay === 'number' ? delay : this.lyTooltipShowDelay;
    if (this._hideTimeoutId) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = null;
    }
    if (!this._tooltipOverlay && this.tooltip && !this._showTimeoutId) {
      const tooltipRef = this.tooltip;

      this._showTimeoutId = <any>setTimeout(() => {
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
              [theme.getBreakpoint('XSmall')]: {
                padding: '8px 16px',
                fontSize: '14px',
              }
            }), undefined, undefined, STYLE_PRIORITY)
          ],
          hasBackdrop: false
        });
        this._updatePosition();
        // const position = new Positioning(this.placement, this.xPosition, this.yPosition, this._el.nativeElement, tooltip.containerElement, this._theme.variables, 13);
        // tooltip.containerElement.style.transform = `translate3d(${position.x}px,${position.y}px,0)`;

        this._theme.requestAnimationFrame(() => {
          this._theme.addStyle('lyTooltip:open', ({
            opacity: 1,
          }), tooltip.containerElement, undefined, STYLE_PRIORITY);
        });

        this._showTimeoutId = null;
        this._markForCheck();
      }, delay);
    }
  }

  hide(delay?: number) {
    // return;
    const tooltipOverlay = this._tooltipOverlay;
    delay = typeof delay === 'number' ? delay : this.lyTooltipHideDelay;
    if (this._showTimeoutId) {
      clearTimeout(this._showTimeoutId);
      this._showTimeoutId = null;
    }
    if (tooltipOverlay && !this._hideTimeoutId) {

      this._hideTimeoutId = <any>setTimeout(() => {
        this._renderer.removeClass(tooltipOverlay.containerElement, this._theme.addStyle('lyTooltip:open', null));
        setTimeout(() => tooltipOverlay.destroy(), 300);
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
}
