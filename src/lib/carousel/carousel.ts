import {
  Component,
  Directive,
  QueryList,
  ContentChildren,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {
  LyTheme2,
  toBoolean,
  ThemeVariables,
  DirAlias,
  ThemeRef,
  lyl,
  keyframesUniqueId,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  shadowBuilder,
  StyleRenderer } from '@alyle/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Platform } from '@angular/cdk/platform';

/** Default interval in ms */
const DEFAULT_INTERVAL = 7000;
const DEFAULT_AUTOPLAY = true;
const DEFAULT_HAS_PROGRESS_BAR = false;
const STYLE_PRIORITY = -2;

export interface LyCarouselTheme {
  /** Styles for Carousel Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyCarouselVariables {
  carousel?: LyCarouselTheme;
}

export const STYLES = (theme: ThemeVariables & LyCarouselVariables, ref: ThemeRef) => {
  const dir = theme.getDirection(DirAlias.before);
  const right = dir === 'right' ? 0 : 180;
  const left = dir === 'left' ? 0 : 180;
  const carousel = ref.selectorsOf(STYLES);
  const barAnimation = keyframesUniqueId.next();
  const { after, before } = theme;
  return {
    $priority: STYLE_PRIORITY,
    $global: lyl `{
      @keyframes ${barAnimation} {
        0% {
          transform: translateX(0%)
        }
        100% {
          transform: translateX(${dir === 'left' ? '-' : ''}100%)
        }
      }
    }`,
    root: ( ) => lyl `{
      display: block
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      position: relative
      & ${carousel.actions}.right {
        ${after}: 0
        transform: rotate(${right}deg)
      }
      & ${carousel.actions}.left {
        ${before}: 0
        transform: rotate(${left}deg)
      }
      & svg {
        display: block
        fill: currentColor
      }
      {
        ...${
          (theme.carousel
            && theme.carousel.root
            && (theme.carousel.root instanceof StyleCollection
              ? theme.carousel.root.setTransformer(fn => fn(carousel))
              : theme.carousel.root(carousel))
          )
        }
      }
    }`,
    actions: lyl `{
      position: absolute
      top: 0
      bottom: 0
      margin: auto .25em
      height: 1em
      width: 1em
      font-size: 36px
      cursor: pointer
      background: ${theme.background.primary.default.alpha(.25)}
      color: ${theme.text.primary}
      will-change: transform
    }`,
    slideContainer: lyl `{
      overflow: hidden
      display: block
      width: 100%
      height: 100%
      position: relative
      touch-action: pan-y !important
    }`,
    slide: lyl `{
      display: flex
      width: 100%
      height: 100%
      will-change: transform
      & > ly-carousel-item {
        width: 100%
        flex-shrink: 0
        position: relative
        background-size: cover
        background-position: center
        background-repeat: no-repeat
      }
    }`,
    slideContent: lyl `{
      display: flex
    }`,
    slideAnim: lyl `{
      & > div {
        transition: transform 750ms cubic-bezier(.1, 1, 0.5, 1)
      }
    }`,
    slideNoEvent: lyl `{
      &>div {
        touch-action: initial !important
        -webkit-user-drag: initial !important
      }
    }`,
    indicators: () => lyl `{
      position: absolute
      bottom: 0
      left: 0
      right: 0
      margin: 0
      box-sizing: border-box
      display: flex
      align-items: center
      justify-content: center
      height: 48px
    }`,
    indicator: () => lyl `{
      display: inline-block
      border-radius: 50%
      cursor: pointer
      position: relative
      padding: .5em
      outline: none
    }`,
    indicatorIcon: () => lyl `{
      transition: 300ms cubic-bezier(0.65, 0.05, 0.36, 1)
      width: 1em
      height: 1em
      transform: scale(.5)
      border-radius: 50%
      will-change: transform
      display: block
      opacity: .65
      box-shadow: ${shadowBuilder(8, theme.text.default)}
      background: ${theme.background.primary.default}
    }`,
    indicatorActive: () => lyl `{
      ${carousel.indicatorIcon} {
        transform: scale(1)
        opacity: 1
      }
    }`,
    barContainer: lyl `{
      background: ${theme.background.primary.default.alpha(.25)}
      height: 4px
      position: absolute
      bottom: 0
      width: 100%
    }`,
    bar: lyl `{
      height: 4px
      position: absolute
      bottom: 0
      width: 100%
      animation-name: ${barAnimation}
      animation-timing-function: linear
      animation-iteration-count: infinite
      background: ${theme.text.primary}
    }`
  };
};

/** @docs-private */
export enum CarouselMode {
  /** full */
  default,
  inline
}

@Component({
  selector: 'ly-carousel',
  templateUrl: './carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    '(mouseenter)': '_onMouseEnter()',
    '(mouseleave)': '_onMouseLeave()'
  },
  providers: [
    StyleRenderer
  ]
})
export class LyCarousel implements OnInit, AfterViewInit, OnDestroy {
  /** @docs-private */
  readonly classes = this.sRenderer.renderSheet(STYLES, true);
  private _intervalFn: number | null = null;
  @ViewChild('slideContainer') slideContainer: ElementRef;
  @ViewChild('_slide') _slide: ElementRef;
  @ViewChild('_progressBar') _progressBar: ElementRef<HTMLDivElement>;
  @ContentChildren(forwardRef(() => LyCarouselItem)) lyItems: QueryList<LyCarouselItem>;
  /** @docs-private */
  @Input() mode: CarouselMode = CarouselMode.default;
  @Input() selectedIndex = 0;
  _selectedElement: HTMLElement;
  private _touch: boolean;
  private _autoplay: boolean;
  private _hasProgressBar: boolean;
  private _interval = DEFAULT_INTERVAL;
  private _slideClass: string;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** @internal */
  get _isIntervalFn() {
    return !!this._intervalFn;
  }

  /**
   * It will pause the slide change when the mouse cursor passes
   * through the carousel.
   */
  @Input()
  get pauseOnHover() {
    return this._pauseOnHover;
  }
  set pauseOnHover(val: boolean) {
    const newVal = toBoolean(val);
    this._pauseOnHover = newVal;
  }
  private _pauseOnHover: boolean;

  @Input()
  set touch(val: boolean) {
    const newVal = toBoolean(val);
    this._touch = newVal;
    if (newVal) {
      this._renderer.removeClass(this._el.nativeElement, this.classes.slideNoEvent);
    } else {
      this._renderer.addClass(this._el.nativeElement, this.classes.slideNoEvent);
    }
  }
  get touch() {
    return this._touch;
  }

  @Input()
  set autoplay(val: boolean) {
    const newVal = toBoolean(val);
    this._autoplay = newVal;
    if (newVal) {
      this._resetInterval();
    } else {
      this.stop();
    }
  }
  get autoplay() {
    return this._autoplay;
  }

  @Input()
  set hasProgressBar(val: boolean) {
    const newVal = toBoolean(val);
    this._hasProgressBar = newVal;
  }
  get hasProgressBar() {
    return this._hasProgressBar;
  }

  @Input()
  set interval(val: number) {
    this._interval = val;
    this._resetInterval();
  }
  get interval() {
    return this._interval;
  }

  @Input()
  set hasNavigationArrows(val: boolean) {
    this._hasNavigationArrows = toBoolean(val);
  }
  get hasNavigationArrows() {
    return this._hasNavigationArrows;
  }
  private _hasNavigationArrows: boolean = true;

  @Input()
  set hasNavigationIndicators(val: boolean) {
    this._hasNavigationIndicators = toBoolean(val);
  }
  get hasNavigationIndicators() {
    return this._hasNavigationIndicators;
  }
  private _hasNavigationIndicators: boolean = true;

  constructor(
    private _el: ElementRef,
    private _cd: ChangeDetectorRef,
    private _theme: LyTheme2,
    private _renderer: Renderer2,
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) { }

  ngOnInit() {
    if (!this.touch) {
      this.touch = false;
    }
    if (this.autoplay == null) {
      this.autoplay = DEFAULT_AUTOPLAY;
    }
    if (this.hasProgressBar == null) {
      this.hasProgressBar = DEFAULT_HAS_PROGRESS_BAR;
    }
  }

  ngAfterViewInit() {
    this._renderer.addClass(this.slideContainer.nativeElement, this.classes.slideContainer);
    if (this._platform.isBrowser) {
      this._renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    }

    this.lyItems.changes.pipe(takeUntil(this._destroy)).subscribe(() => this._markForCheck());
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    if (this._platform.isBrowser) {
      this.stop();
    }
  }

  _onMouseEnter() {
    if (this.pauseOnHover) {
      this.stop();
    }
  }

  _onMouseLeave() {
    if (this.pauseOnHover) {
      this._resetInterval();
    }
  }

  /** @docs-private */
  _onDragStart() {
    this.stop();
    this._renderer.removeClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this._selectedElement = this.lyItems.find((_item, index) => index === this.selectedIndex)!._nativeElement;
  }

  _onDrag(e) {
    const rect = this._selectedElement.getBoundingClientRect();
    if (Math.abs(e.deltaX) < rect.width) {
      this._onPan(e.deltaX);
    } else {
      this._onPan(rect.width * Math.sign(e.deltaX));
    }
  }

  _onDragEnd(e) {
    const rect = this._selectedElement.getBoundingClientRect();
    const dir = this._theme.variables.getDirection(DirAlias.before);
    this._renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this._select(this.selectedIndex);

    if (Math.abs(e.deltaX) > rect.width / 2) {
      if (0 > e.deltaX) {
        this.next();
      } else if (0 < e.deltaX) {
        this.prev();
      }
    } else if (e.additionalEvent) {
      const eventName = e.additionalEvent;
      if (Math.abs(e.velocity) >= 0.25) {
        if (eventName === 'slideleft') {
          if (dir === 'left') {
            this.next();
          } else {
            this.prev();
          }
        } else if (eventName === 'slideright') {
          if (dir === 'right') {
            this.next();
          } else {
            this.prev();
          }
        }
      }
    }
    this._renderer.removeStyle(this._slide.nativeElement, 'transform');
  }

  _onDragCancel() {
    this._renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this._select(this.selectedIndex);
    this._resetInterval();
  }

  _select(val: number, notResetInterval?: boolean) {
    this.selectedIndex = val;
    if (this.mode === CarouselMode.default) {
      this._slideClass = this._theme.addStyle(
        `lyCarousel.select:${val.toString(32)}`,
        (theme: ThemeVariables) => {
          const sign = theme.getDirection(DirAlias.before) === 'left' ? -1 : 1;
          return {
            transform: `translateX(${100 * val * sign}%)`
          };
        },
        this._slide.nativeElement,
        this._slideClass,
        STYLE_PRIORITY
      );
    }
    if (!notResetInterval) {
      if (this.autoplay && !this.pauseOnHover) {
        this._resetInterval();
      }
    }
  }

  prev() {
    const len = this.lyItems.length - 1;
    const prev = this.selectedIndex - 1;
    this._select(prev < 0 ? len : prev);
  }

  next(notResetInterval?: boolean) {
    const len = this.lyItems.length - 1;
    const next = this.selectedIndex + 1;
    this._select(next > len ? 0 : next, notResetInterval);
  }

  stop() {
    if (this._intervalFn !== null) {
      clearInterval(this._intervalFn);
      this._intervalFn = null;
    }
  }

  private _resetInterval() {
    if (this._platform.isBrowser) {
      this.stop();
      this._restartProgressBarAnimation();
      this._markForCheck();
      this._intervalFn = setInterval(() => {
        this.next(true);
        this._restartProgressBarAnimation();
        this._markForCheck();
      }, this.interval) as any;
    }
  }

  private _restartProgressBarAnimation() {
    if (this.hasProgressBar && this._progressBar) {

      const el = this._progressBar.nativeElement;

      // Hack for restart animation
      el.style.animationName = 'øfakeName';
      window.getComputedStyle(el).getPropertyValue('opacity');
      el.style.animationName = '';

    }
  }

  private _onPan(x) {
    const sign = this._theme.variables.getDirection(DirAlias.before) === 'left' ? -1 : 1;
    this._renderer.setStyle(this._slide.nativeElement, 'transform', `translateX(calc(${sign * 100 * this.selectedIndex }% + ${x}px))`);
  }

  private _markForCheck() {
    this._cd.markForCheck();
  }

}

@Directive({
  selector: 'ly-carousel-item'
})
export class LyCarouselItem {
  private _className: string;
  @Input()
  set srcImg(value: string) {
    this._className = this._theme.addStyle(
      `ly-carousel-img:${value}`, (
        `background-image: url('${value}')`
      ),
      this._nativeElement,
      this._className, STYLE_PRIORITY
    );
  }

  _nativeElement: HTMLElement;

  constructor(
    private _theme: LyTheme2,
    _el: ElementRef
  ) {
    this._nativeElement = _el.nativeElement;
  }

}
