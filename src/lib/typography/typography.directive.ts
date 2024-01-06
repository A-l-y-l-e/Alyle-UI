import { Directive, ElementRef, Renderer2, Input, OnInit, OnChanges } from '@angular/core';
import { LyTheme2,
  ThemeVariables,
  mixinStyleUpdater,
  mixinColor,
  StyleCollection,
  StyleTemplate,
  lyl,
  StyleRenderer} from '@alyle/ui';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export interface LyTypographyTheme {
  /** Styles for Typography Component */
  root?: StyleCollection<(() => StyleTemplate)>
    | (() => StyleTemplate);
  lyTyp?: {
    [name: string]: StyleCollection<(() => StyleTemplate)>
      | (() => StyleTemplate) | undefined
  };
}

export interface LyTypographyVariables {
  typography?: LyTypographyTheme;
}

const STYLE_PRIORITY = -1;
export const STYLES = (theme: ThemeVariables & LyTypographyVariables) => {
  return {
    $name: LyTypography.и,
    $priority: STYLE_PRIORITY,
    root: lyl `{
      margin: 0
      display: block
      font-family: ${theme.typography.fontFamily}
      ...${
        (theme.typography
          && theme.typography.root
          && (theme.typography.root instanceof StyleCollection
            ? theme.typography.root.setTransformer(fn => fn()).css
            : theme.typography.root())
        )
      }
    }`,
    gutterTop: lyl `{
      margin-top: 0.35em
    }`,
    gutterBottom: lyl `{
      margin-bottom: 0.35em
    }`,
    gutter: lyl `{
      margin: 0.35em 0
    }`
  };
};


/** @docs-private */
export class LyTypographyBase {
  constructor(
    public _theme: LyTheme2
  ) { }
}

/** @docs-private */
export const LyTypographyMixinBase = mixinStyleUpdater(
    mixinColor((LyTypographyBase)));

@Directive({
  selector: `[lyTyp]`,
  inputs: [
    'color'
  ],
  providers: [
    StyleRenderer
  ]
})
export class LyTypography extends LyTypographyMixinBase implements OnInit, OnChanges {
  /** @docs-private */
  static readonly и = 'LyTypography';
  /** @docs-private */
  readonly classes = this._theme.renderStyleSheet(STYLES);
  private _lyTyp: string;
  private _lyTypClass: string | null;

  private _gutter: boolean;

  private _gutterTop: boolean;

  private _gutterBottom: boolean;
  private _noWrap: boolean;
  private _noWrapClass?: string;

  @Input()
  set lyTyp(val: string) {
    if (val !== this.lyTyp) {
      if (val) {
        this._lyTypClass = this._createTypClass(val, this._lyTypClass);
      } else if (this._lyTypClass) {
        this.renderer.removeClass(this._el.nativeElement, this._lyTypClass);
        this._lyTypClass = null;
      }
    }
  }
  get lyTyp(): string {
    return this._lyTyp;
  }

  /** The text will truncate with an ellipsis. */
  @Input()
  set noWrap(val: BooleanInput) {
    const newValue = coerceBooleanProperty(val);
    if (newValue) {
      this._noWrapClass = this._theme.addSimpleStyle('lyTyp.noWrap', {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      });
      this.renderer.addClass(this._el.nativeElement, this._noWrapClass);
    } else if (this._noWrapClass) {
      this.renderer.removeClass(this._el.nativeElement, this._noWrapClass);
      this._noWrapClass = undefined;
    }
  }
  get noWrap(): boolean {
    return this._noWrap;
  }

  @Input()
  set gutter(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);
    if (newVal !== this.gutter) {
      this._gutter = newVal;
      this.sRenderer.toggleClass(this.classes.gutter, newVal);
    }
  }
  get gutter() {
    return this._gutter;
  }

  @Input()
  set gutterTop(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);
    if (newVal !== this.gutterTop) {
      this._gutterTop = newVal;
      this.sRenderer.toggleClass(this.classes.gutterTop, newVal);
    }
  }
  get gutterTop() {
    return this._gutterTop;
  }

  @Input()
  set gutterBottom(val: BooleanInput) {
    const newVal = coerceBooleanProperty(val);
    if (newVal !== this.gutterBottom) {
      this._gutterBottom = newVal;
      this.sRenderer.toggleClass(this.classes.gutterBottom, newVal);
    }
  }
  get gutterBottom() {
    return this._gutterBottom;
  }

  constructor(
    _theme: LyTheme2,
    private _el: ElementRef,
    private renderer: Renderer2,
    readonly sRenderer: StyleRenderer
  ) {
    super(_theme);
    this.renderer.addClass(this._el.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if ((this.gutterTop && this.gutterBottom)) {
      throw new Error(`use '<element lyTyp gutter>' instead of '<element lyTyp gutterTop gutterBottom>'`);
    }
  }

  ngOnChanges() {
    this.updateStyle(this._el.nativeElement);
  }

  private _createTypClass(val: string, instance: string | null) {
    const newKey = `k-typ:${val}`;

    return this.sRenderer.add(newKey,
      (theme: LyTypographyVariables) => {
        if (theme.typography && theme.typography.lyTyp) {
          const lyTyp = theme.typography.lyTyp[val];
          if (lyTyp) {
              return lyTyp instanceof StyleCollection
                ? lyTyp.setTransformer((_) => _()).css
                : lyTyp();
            }
        }
        throw new Error(`Value typography.lyTyp['${val}'] not found in ThemeVariables`);
      },
      STYLE_PRIORITY,
      instance,
    );
  }

}
