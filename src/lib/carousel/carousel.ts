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
  Optional,
  forwardRef,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CarouselService } from './carousel.service';
import { Platform, LyTheme2, toBoolean } from '@alyle/ui';
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
  classes = {
    root: this.theme.core.setUpStyle(
      'carousel', {
        '': () => (
          `display: block;` +
          `-webkit-user-select: none;` +
          `-moz-user-select: none;` +
          `-ms-user-select: none;` +
          `position: relative;`
        ),
        ' .ly-carousel-actions': () => (
          `position: absolute;` +
          `top: 0;` +
          `bottom: 0;` +
          `margin:auto .25em;` +
          `height:1em;` +
          `width:1em;` +
          `font-size:36px;` +
          `cursor:pointer;` +
          `color: #fff;` +
          `background: rgba(0, 0, 0, 0.11);` +
          `will-change: transform;`
        ),
        ' .ly-carousel-actions.right': () => (
          `right: 0;` +
          `-webkit-transform: rotate(180deg);` +
          `transform: rotate(180deg);`
        ),
        ' svg': () => (
          `display:block;` +
          `fill:currentColor;`
        )
      }
    ),
    slideContainer: this.theme.core.setUpStyle(
      'k-carousel-slide', {
        '': () => (
          `overflow: hidden;` +
          `display: block;` +
          `width: 100%;` +
          `height: 100%;` +
          `position: relative;`
        )
      }
    ),
    slide: this.theme.core.setUpStyleSecondary(
      'carousel-slide', {
        '': () => (
          `display: flex;` +
          `width: 100%;` +
          `height: 100%;` +
          `will-change: transform`
        ),
        ' > ly-carousel-item': () => (
          `width: 100%;` +
          `flex-shrink: 0;` +
          `overflow: auto;` +
          `position: relative;` +
          `background-size: cover;` +
          `background-position: center;` +
          `background-repeat: no-repeat;`
        ),
        ' > ly-carousel-item > [lyCarouselImg]': () => (
          `width: 100%;`
        )
      }
    ),
    slideContent: this.theme.core.setUpStyleSecondary(
      'carousel-slide-content', {
        '': () => (
          `display: flex;`
        )
      }
    ),
    slideAnim: this.theme.core.setUpStyleSecondary(
      'slide-anim', {
        ' > div': () => (
          `transition: transform 750ms cubic-bezier(.1, 1, 0.5, 1);`
        )
      }
    ),
    slideNoEvent: this.theme.core.setUpStyleSecondary(
      'k-slide-no-event', {
        '>div': () => (
          `touch-action: initial !important;`
        )
      }
    ),
    carouselIndicators: this.theme.core.setUpStyleSecondary(
      'k-carousel-indicators', {
        '': () => (
          `position: absolute;` +
          `bottom: 0;` +
          `left: 0;` +
          `right: 0;` +
          `margin: 0;` +
          `box-sizing: border-box;` +
          `display: flex;` +
          `align-items: center;` +
          `justify-content: center;` +
          `height: 48px;`
        ),
        '>div': () => (
          `display: inline-block;` +
          `border-radius: 50%;` +
          `cursor: pointer;` +
          `position: relative;` +
          `padding: .5em;` +
          `outline: none`
        ),
        '>div > span': () => (
          `transition: 300ms cubic-bezier(0.65, 0.05, 0.36, 1);` +
          `width: 1em;` +
          `height: 1em;` +
          `transform: scale(.5);` +
          `border-radius: 50%;` +
          `will-change: transform;` +
          `display: block;`
        ),
        '>div>span.active': () => (
          `transform: scale(1);`
        )
      }
    ),
  };
  private _slideEvent: boolean;
  @Input()
  set slideEvent(val: boolean) {
    const newVal = toBoolean(val);
    this._slideEvent = newVal;
    if (newVal) {
      this.renderer.removeClass(this.elementRef.nativeElement, this.classes.slideNoEvent);
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, this.classes.slideNoEvent);
    }
  }
  get slideEvent() {
    return this._slideEvent;
  }
  onDragStart(e) {
    this.renderer.removeClass(this.slideContainer.nativeElement, this.classes.slideAnim);
    this.selectedElement = this.lyItems.find((item, index) => index === this.selectedIndex)._nativeElement;
  }
  onDrag(e) {
    const rect = this.selectedElement.getBoundingClientRect();
    if (Math.abs(e.deltaX) < rect.width) {
      this._onPan(e.deltaX);
    }
  }
  onDragEnd(e) {
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
  }
  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private theme: LyTheme2,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer.addClass(elementRef.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if (!this.slideEvent) {
      this.slideEvent = false;
    }
    if (Platform.isBrowser) {
      this._resetInterval();
    }
  }

  private _onPan(x) {
    this._positionLeft = this.sanitizerStyle(`translate(calc(${-100 * this.selectedIndex }% + ${x}px), 0px)`) as any;
  }
  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }

  public ngOnDestroy() {
    if (Platform.isBrowser) {
      this.stop();
    }
  }

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
      this._positionLeft = `translate(${-100 * val}%, 0px)`;
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
    }
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ly-carousel-item'
})
export class LyCarouselItem implements OnInit, OnChanges {
  className: string;
  /** @deprecated use srcImg */
  @Input() src: string;
  @Input()
  set srcImg(value: string) {
    const newImgStyle = this.theme.setUpStyleSecondary(
      `ly-carousel-img-${value}`, {
        '': () => (
          `background-image: url('${value}');`
        )
      }
    );
    this.theme.updateClassName(this._nativeElement, this.renderer, newImgStyle, this.className);
    this.className = newImgStyle;
  }
  private _carousel: LyCarousel;
  _nativeElement: HTMLElement;

  constructor(
    @Optional() carousel: LyCarousel,
    private carouselService: CarouselService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private theme: LyTheme2,
    private renderer: Renderer2,
    elementRef: ElementRef
  ) {
    this._carousel = carousel;
    this._nativeElement = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) { }

  ngOnInit() { }

}
