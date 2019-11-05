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
  mixinOutlined,
  mixinRaised,
  mixinShadowColor,
  mixinStyleUpdater,
  ThemeVariables,
  toBoolean,
  lyl,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  ThemeRef,
  LyHostClass
  } from '@alyle/ui';

export interface LyCardTheme {
  /** Styles for Card Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyCardVariables {
  card?: LyCardTheme;
}


export const STYLES = (theme: ThemeVariables & LyCardVariables, ref: ThemeRef) => {
  const card = ref.getClasses(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    root: ( ) => lyl `{
      display: block
      overflow: hidden
      border-radius: 2px
      ...${
        (theme.card
          && theme.card.root
          && (theme.card.root instanceof StyleCollection
            ? theme.card.root.setTransformer(fn => fn(card))
            : theme.card.root(card))
        )
      }
    }`,
    content: lyl `{
      display: block
      padding: 16px 24px
      ${theme.getBreakpoint('XSmall')} {
        padding: 16px 16px
      }
    }`,
    actions: lyl `{
      display: block
      padding: 8px 12px
      ${theme.getBreakpoint('XSmall')} {
        padding: 8px 4px
      }
    }`,
    actionsItem: lyl `{
      margin: 0 4px
    }`
  }
};

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
  mixinColor(
    mixinRaised(
      mixinDisabled(
        mixinOutlined(
          mixinElevation(
            mixinShadowColor(
              mixinDisableRipple(LyCardBase)))))))));

@Directive({
  selector: 'ly-card',
  inputs: [
    'bg',
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
   * @docs-private
   */
  readonly classes = this.theme.renderStyleSheet(STYLES);
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
    let requireOnChanges: boolean | undefined;
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
  selector: 'ly-card-media',
  providers: [LyHostClass]
})
export class LyCardMedia implements OnInit {
  private _bgImg: string;
  private _bgImgClass: string;

  private _ratio: string;
  private _ratioClass: string;

  @Input()
  set bgImg(val: string) {
    if (val !== this.bgImg) {
      this._bgImg = val;
      const newClass = this.theme.renderStyle(
        `lyCardMedia:${val}`,
        () => lyl `{
          display: block
          background-size: cover
          background-repeat: no-repeat
          background-position: center
        }`,
        STYLE_PRIORITY
      );
      this.renderer.setStyle(this.el.nativeElement, `background-image`, `url("${val}")`);
      this._bgImgClass = this.hostClass.update(newClass, this._bgImgClass);
    }
  }
  get bgImg() {
    return this._bgImg;
  }

  /**
   * Aspect ratio
   * 
   * e.g:
   * 4:3
   * 1:1
   */
  @Input()
  set ratio(val: string) {
    if (val !== this.ratio) {
      this._ratio = val;
      const newClass = this.theme.renderStyle(
        `lyCard-media-ar:${val}`,
        () => lyl `{
          &::before {
            content: ''
            display: block
            padding-top: ${val
              .split(':')
              .reduce((prev, current) => (+current / +prev * 100).toString())}%
          }
        }`,
        STYLE_PRIORITY
      );
      this._ratioClass = this.hostClass.update(newClass, this._ratioClass);
    }
  }
  get ratio() {
    return this._ratio;
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private theme: LyTheme2,
    private hostClass: LyHostClass
  ) { }

  ngOnInit() {
    if (!this.ratio) {
      this.ratio = DEFAULT_ASPECT_RATIO;
    }
  }
}
