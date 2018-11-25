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
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Platform, LyTheme2, toBoolean, ThemeVariables } from '@alyle/ui';
import * as _chroma from 'chroma-js';

/** @docs-private */
const chroma = _chroma;

const STYLE_PRIORITY = -2;

const styles = (theme: ThemeVariables) => ({
  root: {
    display: 'block',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    position: 'relative',
    '& {actions}.right': {
      right: 0,
      '-webkit-transform': 'rotate(180deg)',
      transform: 'rotate(180deg)'
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
    color: theme.background.primary.default,
    background: chroma(theme.text.primary).alpha(.25).css(),
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
});

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
  /** docs-private */
  readonly classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  public _selectedIndex: any;
  public nullImg = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  private _intervalFn = null;
  @ViewChild('slideContainer') slideContainer: ElementRef;
  @ContentChildren(forwardRef(() => LyCarouselItem)) lyItems: QueryList<LyCarouselItem>;
  @Input() mode: CarouselMode = CarouselMode.default;
  @Input() interval = 7000;
  _positionLeft: string | number;
  @Input() selectedIndex = 0;
  selectedElement: HTMLElement;
  private _touch: boolean;
  @Input()
  set touch(val: boolean) {
    const newVal = toBoolean(val);
    this._touch = newVal;
    if (newVal) {
      this.renderer.removeClass(this.elementRef.nativeElement, this.classes.slideNoEvent);
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, this.classes.slideNoEvent);
    }
  }
  get touch() {
    return this._touch;
  }

  /** docs-private */
  _onDragStart() {
    this.stop();
    this.renderer.removeClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this.selectedElement = this.lyItems.find((item, index) => index === this.selectedIndex)._nativeElement;
  }

  /** docs-private */
  _onDrag(e) {
    const rect = this.selectedElement.getBoundingClientRect();
    if (Math.abs(e.deltaX) < rect.width) {
      this._onPan(e.deltaX);
    } else {
      this._onPan(rect.width * Math.sign(e.deltaX));
    }
  }

  /** docs-private */
  _onDragEnd(e) {
    const rect = this.selectedElement.getBoundingClientRect();
    this.renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this.select(this.selectedIndex);

    if (Math.abs(e.deltaX) > rect.width / 2) {
      if (0 > e.deltaX) {
        this.next();
      } else if (0 < e.deltaX) {
        this.prev();
      }
    } else if (e.additionalEvent) {
      const eventName = e.additionalEvent;
      if (eventName === 'slideleft') {
        this.next();
      } else if (eventName === 'slideright') {
        this.prev();
      }
    }
    this._resetInterval();
  }

  /** docs-private */
  _onDragCancel() {
    this.renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this.select(this.selectedIndex);
    this._resetInterval();
  }
  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private theme: LyTheme2,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(elementRef.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if (!this.touch) {
      this.touch = false;
    }
    if (Platform.isBrowser) {
      this._resetInterval();
    }
  }

  private _onPan(x) {
    this._positionLeft = this.sanitizerStyle(`translate3d(calc(${-100 * this.selectedIndex }% + ${x}px), 0px, 0)`) as any;
  }
  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this.stop();
    }
  }

  /** docs-private */
  _markForCheck() {
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.slideContainer.nativeElement, this.classes.slideContainer);
    if (Platform.isBrowser) {
      this.renderer.addClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    }
  }
  select(val: number, notResetInterval?: boolean) {
    this.selectedIndex = val;
    if (this.mode === CarouselMode.default) {
      this._positionLeft = `translate3d(${-100 * val}%, 0px, 0)`;
    }
    if (!notResetInterval) {
      this._resetInterval();
    }
  }
  prev() {
    const len = this.lyItems.length - 1;
    const prev = this.selectedIndex - 1;
    this.select(prev < 0 ? len : prev);
  }
  next(notResetInterval?: boolean) {
    const len = this.lyItems.length - 1;
    const next = this.selectedIndex + 1;
    this.select(next > len ? 0 : next, notResetInterval);
  }
  private _resetInterval() {
    this.stop();
    this._intervalFn = setInterval(() => {
      this.next(true);
      this.cd.markForCheck();
    }, this.interval);
  }

  stop() {
    if (this._intervalFn !== null) {
      clearInterval(this._intervalFn);
      this._intervalFn = null;
    }
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ly-carousel-item'
})
export class LyCarouselItem {
  private _className: string;
  @Input()
  set srcImg(value: string) {
    this._className = this.theme.addStyle(
      `ly-carousel-img:${value}`, (
        `background-image: url('${value}')`
      ),
      this._nativeElement,
      this._className, STYLE_PRIORITY
    );
  }
  _nativeElement: HTMLElement;

  constructor(
    private theme: LyTheme2,
    private renderer: Renderer2,
    elementRef: ElementRef
  ) {
    this._nativeElement = elementRef.nativeElement;
  }

}
