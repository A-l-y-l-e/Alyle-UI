import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';
import { LyTheme2, shadowBuilder, defaultEntry, toBoolean } from '@alyle/ui';
import { LyCardClasses } from './card.service';

const DEFAULT_ELEVATION = 2;
const DEFAULT_ASPECT_RATIO = '16:9';

@Directive({
  selector: 'ly-card'
})
export class LyCard implements OnInit {
  private _elevation: string | number;
  private _elevationClass: string;
  @Input()
  set elevation(val: string | number) {
    if (this.elevation !== val) {
      const newClass = this._createElevationClass(val);
      this._elevationClass = this.styler.updateClass(this.el.nativeElement, this.renderer, newClass, this._elevationClass);
    }
  }
  get elevation() {
    return this._elevation;
  }

  constructor(
    private classes: LyCardClasses,
    private styler: LyTheme2,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.card);
    if (this.elevation === void 0) {
      this.elevation = DEFAULT_ELEVATION;
    }
  }

  private _createElevationClass(val: string | number) {
    this._elevation = defaultEntry(val, DEFAULT_ELEVATION);
    return this.styler.setUpStyleSecondary<any>(
      `k-card-e:${this.elevation}`,
      theme => (
        `background-color:${theme.background.primary};` +
        `position:relative;` +
        // `padding:24px;` + // remove this
        `border-radius:2px;` +
        `${shadowBuilder(this.elevation)}`
      )
    );
  }
}

@Directive({
  selector: 'ly-card-content'
})
export class LyCardContent implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private classes: LyCardClasses
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.cardContent);
  }
}

@Directive({
  selector: 'ly-card-actions'
})
export class LyCardActions implements OnInit {
  @Input() disableActionSpacing: boolean;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private classes: LyCardClasses
  ) { }
  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.classes.cardActions);
    if (!toBoolean(this.disableActionSpacing)) {
      this.el.nativeElement.childNodes.forEach(element => {
        this.renderer.addClass(element, this.classes.cardActionsItem);
      });
    }
  }
}

@Directive({
  selector: 'ly-card-media'
})
export class LyCardMedia implements OnInit {
  private _bgImg: string;
  private _bgImgClass: string;

  private _aspectRatio: string;
  private _aspectRatioClass: string;

  @Input()
  set bgImg(val: string) {
    if (val !== this.bgImg) {
      const newClass = this._createBgImgClass(val);
      this._bgImgClass = this.theme.updateClass(this.el.nativeElement, this.renderer, newClass, this._bgImgClass);
    }
  }
  get bgImg() {
    return this._bgImg;
  }

  @Input()
  set aspectRatio(val: string) {
    if (val !== this.aspectRatio) {
      const newClass = this._createAspectRatioClass(val);
      this._aspectRatioClass = this.theme.updateClass(this.el.nativeElement, this.renderer, newClass, this._aspectRatioClass);
    }
  }
  get aspectRatio() {
    return this._aspectRatio;
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2
  ) {}

  ngOnInit() {
    if (!this.aspectRatio) {
      this.aspectRatio = DEFAULT_ASPECT_RATIO;
    }
  }

  private _createBgImgClass(val: string) {
    this._bgImg = val;
    this.renderer.setStyle(this.el.nativeElement, `background-image`, `url("${val}")`);
    return this.theme.setUpStyle(
      `k-card-media:${val}`,
      () => (
        `display:block;` +
        `background-size: cover;` +
        `background-repeat: no-repeat;` +
        `background-position: center;`
      )
    );
  }

  private _createAspectRatioClass(val: string) {
    this._aspectRatio = val;
    return this.theme.setUpStyle(
      `k-card-media-ar:${val}`,
      () => {
        return (
          val.split(':').reduce((valorAnterior, valorActual) => {
            return `padding-top:${+valorActual / +valorAnterior * 100}%`;
          })
        );
      }
    );
  }
}
