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
  lyl,
  StyleCollection,
  LyClasses,
  StyleTemplate,
  ThemeRef,
  StyleRenderer,
  WithStyles,
  Style
  } from '@alyle/ui';
import { Platform } from '@angular/cdk/platform';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export interface LyCardTheme {
  /** Styles for Card Component */
  root?: StyleCollection<((classes: LyClasses<typeof STYLES>) => StyleTemplate)>
  | ((classes: LyClasses<typeof STYLES>) => StyleTemplate);
}

export interface LyCardVariables {
  card?: LyCardTheme;
}


export const STYLES = (theme: ThemeVariables & LyCardVariables, ref: ThemeRef) => {
  const card = ref.selectorsOf(STYLES);
  return {
    $priority: STYLE_PRIORITY,
    $name: LyCard.и,
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
    bgImg: lyl `{
      display: block
      background-size: cover
      background-repeat: no-repeat
      background-position: center
    }`,
    content: lyl `{
      display: block
      padding: 16px 24px
      @media ${theme.breakpoints['XSmall']} {
        padding: 16px 16px
      }
    }`,
    actions: lyl `{
      display: block
      padding: 8px 12px
      @media ${theme.breakpoints['XSmall']} {
        padding: 8px 4px
      }
    }`,
    actionsItem: lyl `{
      margin: 0 4px
    }`
  };
};

const DEFAULT_ASPECT_RATIO = '16:9';

const STYLE_PRIORITY = -1;

/** @docs-private */
export class LyCardBase {
  constructor(
    public _theme: LyTheme2,
    public _ngZone: NgZone,
    public _platform: Platform
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
  ],
  providers: [StyleRenderer],
  standalone: false
})
export class LyCard extends LyCardMixinBase implements OnChanges, OnInit, OnDestroy {
  static readonly и = 'LyCard';
  /**
   * styles
   * @docs-private
   */
  readonly classes = this.theme.renderStyleSheet(STYLES);
  constructor(
    private theme: LyTheme2,
    private _el: ElementRef,
    private renderer: Renderer2,
    ngZone: NgZone,
    platform: Platform
  ) {
    super(theme, ngZone, platform);
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
  selector: 'ly-card-content',
  standalone: false
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
  selector: 'ly-card-actions',
  standalone: false
})
export class LyCardActions implements OnInit {
  @Input() disableActionSpacing: BooleanInput;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private card: LyCard
  ) { }
  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, this.card.classes.actions);
    if (!coerceBooleanProperty(this.disableActionSpacing)) {
      this.el.nativeElement.childNodes.forEach(element => {
        this.renderer.addClass(element, this.card.classes.actionsItem);
      });
    }
  }
}

/**
 * @dynamic
 */
@Directive({
  selector: 'ly-card-media',
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class LyCardMedia implements WithStyles, OnInit {

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
      this[0x2] = this.sRenderer.add(
        `${LyCardMedia.и}--ratio-${val}`,
        () => lyl `{
          &::before {
            content: ''
            display: block
            padding-top: ${val
              .split(':')
              .reduce((prev, current) => (+current / +prev * 100).toString())}%
          }
        }`,
        STYLE_PRIORITY,
        this[0x2]
      );
    }
  }
  get ratio() {
    return this._ratio;
  }

  constructor(
    readonly sRenderer: StyleRenderer,
    card: LyCard
  ) {
    sRenderer.addClass(card.classes.bgImg);
  }
  static readonly и = 'LyCardMedia';
  static readonly $priority = STYLE_PRIORITY;

  static ngAcceptInputType_bgImg: string;

  private _ratio: string;

  @Input()
  @Style<string>((val) => () => lyl `{
    background-image: url('${val}')
  }`)
  bgImg: string;
  [0x2]: string;

  ngOnInit() {
    if (!this.ratio) {
      this.ratio = DEFAULT_ASPECT_RATIO;
    }
  }
}
