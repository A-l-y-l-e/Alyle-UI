import { Directive, Renderer2, ElementRef, Input, OnInit, Optional } from '@angular/core';
import { LyTheme2, toBoolean, LyCommon } from '@alyle/ui';
import { LyCardService } from './card.service';

const DEFAULT_ASPECT_RATIO = '16:9';

@Directive({
  selector: 'ly-card'
})
export class LyCard implements OnInit {
  // private _elevation: string | number;
  // private _elevationClass: string;
  // @Input()
  // set elevation(val: string | number) {
  //   if (this.elevation !== val) {
  //     const newClass = this._createElevationClass(val);
  //     this._elevationClass = this.styler.updateClass(this.el.nativeElement, this.renderer, newClass, this._elevationClass);
  //   }
  // }
  // get elevation() {
  //   return this._elevation;
  // }

  constructor(
    private cardService: LyCardService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private common: LyCommon
  ) { }

  ngOnInit() {
    let requireOnChanges: boolean;
    if (!this.common.bg) {
      this.common.bg = 'background:primary';
      requireOnChanges = true;
    }
    if (!this.common.elevation) {
      this.common.elevation = 2;
      requireOnChanges = true;
    }
    if (!this.common.shadowColor) {
      this.common.shadowColor = 'colorShadow';
      requireOnChanges = true;
    }
    if (requireOnChanges) {
      this.common.ngOnChanges();
    }
    this.renderer.addClass(this.el.nativeElement, this.cardService.classes.root);
    // if (this.elevation === void 0) {
    //   this.elevation = DEFAULT_ELEVATION;
    // }
  }
}

@Directive({
  selector: 'ly-card-content'
})
export class LyCardContent implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cardService: LyCardService
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.cardService.classes.content);
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
    private cardService: LyCardService
  ) { }
  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.cardService.classes.actions);
    if (!toBoolean(this.disableActionSpacing)) {
      this.el.nativeElement.childNodes.forEach(element => {
        this.renderer.addClass(element, this.cardService.classes.actionsItem);
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

  private _ratio: string;
  private _ratioClass: string;

  @Input()
  set bgImg(val: string) {
    if (val !== this.bgImg) {
      this._bgImgClass = this._createBgImgClass(val, this._bgImgClass);
    }
  }
  get bgImg() {
    return this._bgImg;
  }

  /** Aspect ratio */
  @Input()
  set ratio(val: string) {
    if (val !== this.ratio) {
      this._createAspectRatioClass(val);
    }
  }
  get ratio() {
    return this._ratio;
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2
  ) {}

  ngOnInit() {
    if (!this.ratio) {
      this.ratio = DEFAULT_ASPECT_RATIO;
    }
  }

  private _createBgImgClass(val: string, instance: string) {
    this._bgImg = val;
    this.renderer.setStyle(this.el.nativeElement, `background-image`, `url("${val}")`);
    return this.theme.addStyle(
      `lyCard-media:${val}`,
      (
        `display:block;` +
        `background-size: cover;` +
        `background-repeat: no-repeat;` +
        `background-position: center;`
      ),
      this.el.nativeElement,
      instance
    );
  }

  private _createAspectRatioClass(val: string) {
    this._ratio = val;
    this._ratioClass = this.theme.addStyle(
      `lyCard-media-ar:${val}`, ({
        '&:before': val.split(':').reduce((valorAnterior, valorActual) => {
          return ({
            paddingTop: `${+valorActual / +valorAnterior * 100}%`,
            content: `\'\'`,
            display: 'block'
          }) as any;
        })
      }),
      this.el.nativeElement,
      this._ratioClass
    );
  }
}
