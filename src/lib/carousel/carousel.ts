import {
  Component,
  Directive,
  QueryList,
  ContentChild,
  ContentChildren,
  Input,
  Output,
  EventEmitter,
  NgModule,
  TemplateRef,
  ModuleWithProviders,
  AfterContentInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
  Optional,
  forwardRef,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
  OnInit,
  Renderer2,
  HostListener
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer, CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CarouselService } from './carousel.service';
import { Platform, LyTheme2 } from '@alyle/ui';
export enum CarouselMode {
  /** full */
  default,
  inline
}

@Component({
  selector: 'ly-carousel',
  styleUrls: ['carousel.scss'],
  templateUrl: './carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyCarousel implements AfterViewInit, OnDestroy {
  public data: any;
  public value: any;
  public _selectedIndex: any;
  public _fnInterval: any;
  public nullImg = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  private _intervalFn: () => void;
  @ContentChildren(forwardRef(() => LyCarouselItemComponent)) lyItems: QueryList<LyCarouselItemComponent>;
  @Input() mode: CarouselMode = CarouselMode.default;
  @Input() interval = 60000;
  positionLeft: string | number;
  _itemSelect = 0;
  @Input() selectedIndex = 0;
  selectedElement: HTMLElement;
  classes = {
    root: this.theme.core.setUpStyle(
      'carousel', {
        '': () => (
          `overflow: hidden;` +
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
          `background: rgba(0, 0, 0, 0.11);`
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
    slide: this.theme.core.setUpStyleSecondary(
      'carousel-slide', {
        '': () => (
          `position:absolute;` +
          `display: flex;` +
          `width: 100%;` +
          `top: 0;` +
          `left: 0;` +
          `right: 0;` +
          `bottom: 0;`
        ),
        ' > ly-carousel-item': () => (
          `min-width: 100%;` +
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
          `transition: left 750ms cubic-bezier(.1, 1, 0.5, 1);`
        )
      }
    ),
  };
  onDragStart(e) {
    this.renderer.removeClass(this.elementRef.nativeElement, this.classes.slideAnim);
    this.selectedElement = this.lyItems.find((item, index) => index === this.selectedIndex)._nativeElement;
  }
  onDrag(e) {
    console.log(e);
    const rect = this.selectedElement.getBoundingClientRect();
    if (Math.abs(e.deltaX) < rect.width) {
      this._onPan(e.deltaX);
    }
  }
  onDragEnd(e) {
    const rect = this.selectedElement.getBoundingClientRect();
    this.renderer.addClass(this.elementRef.nativeElement, this.classes.slideAnim);
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
    this.renderer.addClass(elementRef.nativeElement, this.classes.slideAnim);
  }
  private _onPan(x) {
    this.positionLeft = this.sanitizerStyle(`calc(${-100 * this.selectedIndex }% + ${x}px)`) as any;
    // console.log(`calc(${-100 * this.selectedIndex }% + ${event.deltaX}px)`);
  }
  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }

  public ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      clearInterval(this._fnInterval);
    }
  }
  public _intervalCarousel(value: any = '+') {
    if (isPlatformBrowser(this.platformId)) {
      if (value === '+') {
        this._itemSelect++;
        this._itemSelect = (this._itemSelect === (this.lyItems.length) ? 0 : this._itemSelect);
        // console.log(this._itemSelect, this.lyItems.length);
      } else if (value === '-') {
        this._itemSelect--;
        this._itemSelect = (this._itemSelect <= -1 ? (this.lyItems.length - 1) : this._itemSelect--);
        // console.log('--',this._itemSelect, this.lyItems.length);
      } else {
        this._itemSelect = value;
      }
      const intrval$ = {
        interval$: setInterval(() => {
          this._itemSelect++;
          this._itemSelect = (this._itemSelect === (this.lyItems.length) ? 0 : this._itemSelect++);
          // console.log('interval state', this._itemSelect);
          // this.setActiveItem();
        }, this.interval)
      };
      clearInterval(this._fnInterval);
      this._fnInterval = intrval$.interval$;
      // this.setActiveItem();
    }
  }
  resetInterval() {

  }

  _markForCheck() {
    this.cd.markForCheck();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this._intervalCarousel(0);
      this.lyItems.changes.subscribe((carousel: LyCarouselItemComponent) => {
        this._itemSelect = 0;
        this._intervalCarousel(0);
        // this.setActiveItem();
        this.cd.markForCheck();
      });
    }
  }
  public select(val: number) {
    this.selectedIndex = val;
    if (this.mode === CarouselMode.default) {
      this.positionLeft = `${-100 * val}%`;
    }
    // this._intervalCarousel(val);
  }
  public focusRight() {
    this._intervalCarousel('+');
  }
  public focusLeft() {
    this._intervalCarousel('-');
  }
  prev() {
    const len = this.lyItems.length - 1;
    const prev = this.selectedIndex - 1;
    this.select(prev < 0 ? len : prev);
  }
  next() {
    const len = this.lyItems.length - 1;
    const next = this.selectedIndex + 1;
    this.select(next > len ? 0 : next);
  }
}

@Component({
  selector: 'ly-carousel-item',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyCarouselItemComponent implements OnInit, OnChanges {
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

  _markForCheck() {
    this.cd.markForCheck();
  }
}
