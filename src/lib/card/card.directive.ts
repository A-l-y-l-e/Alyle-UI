import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2
  } from '@angular/core';
import {
  LyTheme2,
  mixinBg,
  mixinColor,
  mixinDisabled,
  mixinDisableRipple,
  mixinElevation,
  mixinFlat,
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
  toBoolean
  } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  root: {
    display: 'block',
    overflow: 'hidden',
    borderRadius: '2px'
  },
  content: {
    display: 'block',
    padding: '16px 24px',
    [theme.getBreakpoint('XSmall')]: {
      padding: '16px 16px'
    }
  },
  actions: {
    display: 'block',
    padding: '8px 12px',
    [theme.getBreakpoint('XSmall')]: {
      padding: '8px 4px'
    }
  },
  actionsItem: {
    margin: '0 4px'
  }
});

const DEFAULT_ASPECT_RATIO = '16:9';

const STYLE_PRIORITY = -1;

/** @docs-private */
export class LyCardBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone
  ) { }
}

/** @docs-private */
export const LyCardMixinBase = mixinStyleUpdater(
mixinBg(
  mixinFlat(
    mixinColor(
      mixinRaised(
        mixinDisabled(
          mixinOutlined(
            mixinElevation(
              mixinShadowColor(
                mixinDisableRipple(LyCardBase))))))))));

@Directive({
  selector: 'ly-card',
  inputs: [
    'bg',
    'flat',
    'color',
    'raised',
    'outlined',
    'elevation',
    'shadowColor',
    'disableRipple',
  ]
})
export class LyCard extends LyCardMixinBase implements OnChanges, OnInit, OnDestroy {
  /**
   * styles
   * @ignore
   */
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);
  constructor(
    private theme: LyTheme2,
    private _el: ElementRef,
    private renderer: Renderer2,
    ngZone: NgZone
  ) {
    super(theme, ngZone);
    this.setAutoContrast();
  }

  ngOnChanges() {
    this.updateStyle(this._el);
  }

  ngOnInit() {
    let requireOnChanges: boolean;
    if (!this.bg) {
      this.bg = 'background:primary';
      requireOnChanges = true;
    }
    if (!this.elevation) {
      this.elevation = 2;
      requireOnChanges = true;
    }
    if (requireOnChanges) {
      this.updateStyle(this._el);
    }
    this.renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  ngOnDestroy() {
    this._removeRippleEvents();
  }
}

@Directive({
  selector: 'ly-card-content'
})
export class LyCardContent implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private card: LyCard
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.card.classes.content);
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
    private card: LyCard
  ) { }
  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.card.classes.actions);
    if (!toBoolean(this.disableActionSpacing)) {
      this.el.nativeElement.childNodes.forEach(element => {
        this.renderer.addClass(element, this.card.classes.actionsItem);
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
  ) { }

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
      instance,
      STYLE_PRIORITY
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
      this._ratioClass,
      STYLE_PRIORITY
    );
  }
}
