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
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Platform, LyTheme2, toBoolean, ThemeVariables, DirAlias } from '@alyle/ui';
import * as _chroma from 'chroma-js';

/** @docs-private */
const chroma = _chroma;

const STYLE_PRIORITY = -2;

export const STYLES = (theme: ThemeVariables) => {
  const dir = theme.getDirection(DirAlias.before);
  const right = dir === 'right' ? 0 : 180;
  const left = dir === 'left' ? 0 : 180;
  return {
    root: {
      display: 'block',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      position: 'relative',
      '& {actions}.right': {
        after: 0,
        transform: `rotate(${right}deg)`
      },
      '& {actions}.left': {
        before: 0,
        transform: `rotate(${left}deg)`
      },
      '& svg': {
        display: 'block',
        fill: 'currentColor'
      }
    },
    actions: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      margin: 'auto .25em',
      height: '1em',
      width: '1em',
      fontSize: '36px',
      cursor: 'pointer',
      background: chroma(theme.background.primary.default).alpha(.25).css(),
      color: theme.text.primary,
      willChange: 'transform'
    },
    slideContainer: {
      overflow: 'hidden',
      display: 'block',
      width: '100%',
      height: '100%',
      position: 'relative',
      touchAction: 'pan-y !important'
    },
    slide: {
      display: 'flex',
      width: '100%',
      height: '100%',
      willChange: 'transform',
      '& > ly-carousel-item': {
        width: '100%',
        flexShrink: 0,
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    },
    slideContent: {
      display: 'flex'
    },
    slideAnim: {
      '& > div': {
        transition: 'transform 750ms cubic-bezier(.1, 1, 0.5, 1)'
    }
    },
    slideNoEvent: {
      '&>div': {
        touchAction: 'initial !important'
      }
    },
    carouselIndicators: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      margin: 0,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '48px',
      '&>div': {
        display: 'inline-block',
        borderRadius: '50%',
        cursor: 'pointer',
        position: 'relative',
        padding: '.5em',
        outline: 'none'
      },
      '&>div > span': {
        transition: '300ms cubic-bezier(0.65, 0.05, 0.36, 1)',
        width: '1em',
        height: '1em',
        transform: 'scale(.5)',
        borderRadius: '50%',
        willChange: 'transform',
        display: 'block',
        opacity: .65
      },
      '&>div>span.active': {
        transform: 'scale(1)',
        opacity: 1
      }
    }
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
  encapsulation: ViewEncapsulation.None
})
export class LyCarousel implements OnInit, AfterViewInit, OnDestroy {
  /** @docs-private */
  readonly classes = this._theme.addStyleSheet(STYLES, STYLE_PRIORITY);
  private _intervalFn = null;
  @ViewChild('slideContainer') slideContainer: ElementRef;
  @ViewChild('_slide') _slide: ElementRef;
  @ContentChildren(forwardRef(() => LyCarouselItem)) lyItems: QueryList<LyCarouselItem>;
  /** @docs-private */
  @Input() mode: CarouselMode = CarouselMode.default;
  @Input() interval = 7000;
  @Input() selectedIndex = 0;
  _selectedElement: HTMLElement;
  private _touch: boolean;
  private _slideClass: string;
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

  constructor(
    private _el: ElementRef,
    private _cd: ChangeDetectorRef,
    private _theme: LyTheme2,
    private _renderer: Renderer2
  ) {
    this._renderer.addClass(_el.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if (!this.touch) {
      this.touch = false;
    }
    if (Platform.isBrowser) {
      this._resetInterval();
    }
  }

  ngAfterViewInit() {
    this._renderer.addClass(this.slideContainer.nativeElement, this.classes.slideContainer);
    if (Platform.isBrowser) {
      this._renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    }
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this.stop();
    }
  }

  /** @docs-private */
  _onDragStart() {
    this.stop();
    this._renderer.removeClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this._selectedElement = this.lyItems.find((_item, index) => index === this.selectedIndex)._nativeElement;
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
    const dir = this._theme.config.getDirection(DirAlias.before);
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
    this._resetInterval();
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
      this._resetInterval();
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
    this.stop();
    this._intervalFn = setInterval(() => {
      this.next(true);
      this._markForCheck();
    }, this.interval);
  }

  private _onPan(x) {
    const sign = this._theme.config.getDirection(DirAlias.before) === 'left' ? -1 : 1;
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
