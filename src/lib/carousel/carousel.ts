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
  OnInit
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CarouselService } from './carousel.service';
import { Platform } from '@alyle/ui';

@Component({
  selector: 'ly-carousel',
  styleUrls: ['carousel.scss'],
  template: `
  <div class="lycarousel-slide">
    <!--buttons-->
    <div class="carousel-indicators-container">
      <div class="carousel-blur" [style.background-image]="'url('+lyItems.toArray()[_itemSelect]?.src+')'"></div>
    </div>
    <ul class="carousel-indicators" *ngIf="lyItems.length!=1">
      <li tabindex="0"
      (click)="select(i)"
      role="button"
      *ngFor="let item of lyItems; let i = index">
      <span color="#000"
      bg="#fff"
      [class.active]="_itemSelect==i"
      [newRaised]="[6]"></span>
      </li>
    </ul>
    <!--items-->
    <div class="lycarousel-items">
      <div [class.active]="_itemSelect==i"
      class="lycarousel-item"
      *ngFor="let item of lyItems; let i = index">
        <img [src]="nullImg"
        [style.background-image]="'url('+item.src+')'">
      </div>
      <!--<div class="lycarousel-content">
      <ng-content></ng-content>
      </div>-->
    </div>
    <!--cursor-->
  </div>
  <div class="lycarousel-content ly-carousel-container">
    <ng-content></ng-content>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class LyCarousel implements AfterViewInit, OnDestroy {
  public data: any;
  public value: any;
  public _selectedIndex: any;
  public _interval = 60000;
  public _fnInterval: any;
  public nullImg = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  @ContentChildren(forwardRef(() => LyCarouselItemComponent)) lyItems: QueryList<LyCarouselItemComponent>;
  _itemSelect = 0;
  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }
  @Input('interval')
  public get interval(): number { return this._interval; }
  public set interval(value: number) {
    this._interval = value;
  }
  public get stateIndicator() {
    if (this.lyItems === undefined) {
      return 0;
    } else {
      const st = (this._itemSelect + 1) * 100 / this.lyItems.length;
      return st;
    }
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
          this.setActiveItem();
        }, this._interval)
      };
      clearInterval(this._fnInterval);
      this._fnInterval = intrval$.interval$;
      this.setActiveItem();
    }
  }
  setActiveItem() {
    // let activeItems = this.lyItems.filter((tab)=>tab.active);
    Promise.resolve(null).then(() => {
      const controlsBottom = this.elementRef.nativeElement.querySelector('.carousel-indicators-container');
      // controlsBottom.classList.remove('animation');
      // // tslint:disable-next-line:no-unused-expression
      // void controlsBottom.offsetWidth;
      // controlsBottom.classList.add('animation');
      this.lyItems.forEach((_item: LyCarouselItemComponent) => {
        _item.lyCarouselActive = false;
        _item._markForCheck();
      });
      const item = this.lyItems.find((a: LyCarouselItemComponent, b: number) => b === this._itemSelect);
      item.lyCarouselActive = true;
      this.cd.markForCheck();
    });
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
        this.setActiveItem();
        this.cd.markForCheck();
      });
    }
  }
  public select(val: number) {
    this._intervalCarousel(val);
  }
  public focusRight() {
    this._intervalCarousel('+');
  }
  public focusLeft() {
    this._intervalCarousel('-');
  }
}

@Component({
  selector: 'ly-carousel-item',
  styles: [`
    :host:not(.ly-carousel-item-active) {
      display: none !important;
    }
  `],
  template: `
  <ng-template [ngIf]="lyCarouselActive">
    <ng-content></ng-content>
  </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyCarouselItemComponent implements OnInit, OnChanges {
  @Input() src: string;
  @Input() @HostBinding('class.ly-carousel-item-active') lyCarouselActive = false;
  private _carousel: LyCarousel;

  constructor(
    @Optional() carousel: LyCarousel,
    private carouselService: CarouselService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._carousel = carousel;
  }

  ngOnChanges(changes: SimpleChanges) { }

  ngOnInit() { }

  _markForCheck() {
    this.cd.markForCheck();
  }
}
