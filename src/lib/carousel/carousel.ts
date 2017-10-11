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
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding
} from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { LyShadowModule, LyShadowService } from 'alyle-ui/shadow';
import { CarouselService, VibrantColors } from './carousel.service';
import { MinimalLS } from 'alyle-ui/ls';

@Component({
  selector: 'ly-carousel-item',
  styles: [`
    :host:not(.ly-carousel-item-active) {
      display: none !important;
    }
  `],
  template: `
  <ng-template [ngIf]="active">
    <ng-content></ng-content>
  </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyCarouselItemComponent {
  @Input('src') src: string;
  @Input('ly-carousel-active') @HostBinding('class.ly-carousel-item-active') active = false;
  color: VibrantColors = new VibrantColors;

  constructor(
    private carouselService: CarouselService,
    private ls: MinimalLS,
    private cd: ChangeDetectorRef
  ) { }

  preloadImage(url) {
    try {
      const img = new Image();
      img.src = url;
    } catch (e) { }
  }

  ngOnInit() {
    this.preloadImage(this.src);
    if (this.ls.hasItem(this.src)) {
      this.color = this.ls.item(this.src);
    } else {
      const colorV = this.carouselService.getColorVibrant(this.src);
      colorV.then((p: any) => {
        this.color = this.carouselService._palette(p);
        /**
         * TODO: update this.color on change
         */
      });
    }
  }
  _markForCheck() {
    this.cd.markForCheck();
  }
}

@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-carousel',
  styleUrls: ['carousel.scss'],
  template: `
  <div class="lycarousel-slide" ly-shadow [shadowColor]="lyItems.toArray()[_itemSelect]?.color.DarkMuted.hex || '#fff'" scale="2">
    <!--buttons-->
    <div class="carousel-indicators-container animation">
      <div class="carousel-blur" [style.background-image]="'url('+lyItems.toArray()[_itemSelect]?.src+')'"></div>
    </div>
    <ul class="carousel-indicators" *ngIf="lyItems.length!=1">
      <li tabindex="0"
      (click)="select(i)"
      role="button"
      [class.active]="_itemSelect==i"
      [style.background-color]="item.color.Vibrant.hex"
      [style.color]="item.color.DarkVibrant.hex"
      [class.ly-carousel-inactive-button]="!(_itemSelect == i)"
      *ngFor="let item of lyItems; let i = index"></li>
    </ul>
    <!--items-->
    <div class="lycarousel-items" [style.background-color]="lyItems.toArray()[_itemSelect]?.color.DarkVibrant.hex">
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
  <div *ngIf="lyItems.length!=1" (click)="focusLeft()" class="lycarousel-cursor-left"></div>
  <div *ngIf="lyItems.length!=1" (click)="focusRight()" class="lycarousel-cursor-right"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LyCarousel implements ControlValueAccessor {
  public data: any;
  public value: any;
  public _selectedIndex: any;
  public _interval = 2000;
  public _fnInterval: any;
  public _isInitialized = false;
  public nullImg = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  @ContentChildren(LyCarouselItemComponent) public lyItems: QueryList<LyCarouselItemComponent>;
  _itemSelect = 0;
  currentCarousel: LyCarouselItemComponent;
  currentColors: VibrantColors;
  /** Callback registered via registerOnTouched (ControlValueAccessor) */
  private _onTouchedCallback: () => void;

  /** Callback registered via registerOnChange (ControlValueAccessor) */
  private _onChangeCallback: (_: any) => void;
  constructor(
    private elementRef: ElementRef,
    private shadow: LyShadowService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }
  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }
  @Input('interval')
  public get interval(): number { return this._interval; }
  public set interval(value: number) {
    this._interval = value;
    // this._intervalCarousel(0);
  }

  public registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }
  public get stateIndicator() {
    if (this.lyItems === undefined) {
      return 0;
    } else {
      const st = (this._itemSelect + 1) * 100 / this.lyItems.length;
      return st;
    }
  }
  public get stylesBar() {
    const bar = this.elementRef.nativeElement.querySelector('._bar');
    // bar.style.animation = `none`;
    return {
      animation: `none`
    };
  }

  public registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  public writeValue(value: any) {
    // nothing
  }

  public ngOnDestroy() {
    clearInterval(this._fnInterval);
  }
  public _intervalCarousel(value: any = '+') {
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
  setActiveItem() {
    // let activeItems = this.lyItems.filter((tab)=>tab.active);
    Promise.resolve(null).then(() => {
      const controlsBottom = this.elementRef.nativeElement.querySelector('.carousel-indicators-container');
      controlsBottom.classList.remove('animation');
      void controlsBottom.offsetWidth;
      controlsBottom.classList.add('animation');
      this.lyItems.forEach((item: LyCarouselItemComponent) => {item.active = false; item._markForCheck(); });
      const item = this.lyItems.find((a: LyCarouselItemComponent, b: number) => b == this._itemSelect);
      this.currentCarousel = item;
      this.currentColors = item.color;
      item.active = true;
      this.cd.markForCheck();
    });
  }

  ngAfterViewInit() {
    // let actives = this.lyItems.filter((item) => item.active == true);
    // if (actives.length >= 1) {
    //   // console.log('actives', actives);
    // }
    // this._isInitialized = true;
    this._intervalCarousel(0);
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

const LY_CAROUSEL_DIRECTIVES = [LyCarouselItemComponent, LyCarousel];

@NgModule({
  imports: [CommonModule, FormsModule, LyShadowModule],
  exports: [LY_CAROUSEL_DIRECTIVES],
  declarations: [LY_CAROUSEL_DIRECTIVES],
  providers: [LyShadowService, CarouselService]
})
export class LyCarouselModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyCarouselModule,
    };
  }
}
