import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
import { LyTheme2, toBoolean, ThemeVariables, StyleContainer } from '@alyle/ui';

const STYLE_PRIORITY = -1;
const styles = (theme: ThemeVariables) => ({
  root: {
    margin: 0,
    display: 'block',
    ...theme.typography.root
  }
});

/** @docs-private */
enum Gutter {
  default,
  top,
  bottom,
}

@Directive({
  selector: `[lyTyp]`
})
export class LyTypography implements OnInit {
  /** @docs-private */
  readonly classes = this.style.addStyleSheet(styles, STYLE_PRIORITY);
  private _lyTyp: string;
  private _lyTypClass?: string;

  private _gutter: boolean;
  private _gutterClass: string;

  private _gutterTop: boolean;
  private _gutterTopClass: string;

  private _gutterBottom: boolean;
  private _gutterBottomClass: string;
  private _noWrap: boolean;
  private _noWrapClass?: string;

  @Input()
  set lyTyp(val: string) {
    if (val !== this.lyTyp) {
      if (val) {
        this._lyTypClass = this._createTypClass(val, this._lyTypClass);
      } else if (this._lyTypClass) {
        this.renderer.removeClass(this.elementRef.nativeElement, this._lyTypClass);
        this._lyTypClass = undefined;
      }
    }
  }
  get lyTyp() {
    return this._lyTyp;
  }

  /** The text will truncate with an ellipsis. */
  @Input()
  set noWrap(val: boolean) {
    const newValue = toBoolean(val);
    if (newValue) {
      this._noWrapClass = this.style.addSimpleStyle('lyTyp.noWrap', {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      });
      this.renderer.addClass(this.elementRef.nativeElement, this._noWrapClass);
    } else if (this._noWrapClass) {
      this.renderer.removeClass(this.elementRef.nativeElement, this._noWrapClass);
      this._noWrapClass = undefined;
    }
  }
  get noWrap() {
    return this._noWrap;
  }

  @Input()
  set gutter(val: boolean) {
    const newVal = toBoolean(val);
    if (newVal !== this.gutter) {
      this._gutter = newVal;
      this._gutterClass = this._createGutterClass(Gutter.default, newVal, this._gutterClass);
    }
  }
  get gutter() {
    return this._gutter;
  }

  @Input()
  set gutterTop(val: boolean) {
    const newVal = toBoolean(val);
    if (newVal !== this.gutterTop) {
      this._gutterTop = newVal;
      // const newClass = this._createGutterClass(Gutter.top, newVal);
      this._gutterTopClass = this._createGutterClass(Gutter.top, newVal, this._gutterTopClass);
    }
  }
  get gutterTop() {
    return this._gutterTop;
  }

  @Input()
  set gutterBottom(val: boolean) {
    const newVal = toBoolean(val);
    if (newVal !== this.gutterBottom) {
      this._gutterBottom = newVal;
      this._gutterBottomClass = this._createGutterClass(Gutter.bottom, newVal, this._gutterBottomClass);
    }
  }
  get gutterBottom() {
    return this._gutterBottom;
  }

  constructor(
    private style: LyTheme2,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if ((this.gutterTop && this.gutterBottom)) {
      throw new Error(`use '<element lyTyp gutter>' instead of '<element lyTyp gutterTop gutterBottom>'`);
    }
  }

  private _createTypClass(key: string, instance?: string) {
    const newKey = `k-typ:${key}`;

    return this.style.addStyle(newKey,
      (theme: ThemeVariables) => {
        const { typography } = theme;
        const styl: StyleContainer = Object.assign({ }, typography.lyTyp[key || 'body1']);
        if (styl.lineHeight) {
          styl.lineHeight = theme.pxToRem(styl.lineHeight as number);
        }
        if (typeof styl.letterSpacing === 'number') {
          styl.letterSpacing = `${styl.letterSpacing}px`;
        }
        // set default fontFamily
        styl.fontFamily = styl.fontFamily || typography.fontFamily;
        return styl;
      },
      this.elementRef.nativeElement,
      instance,
      STYLE_PRIORITY
    );
  }

  private _createGutterClass(name: Gutter, val: boolean, instance: string) {
    return this.style.addStyle(
      `k-typ-gutter:${name}:${val}`,
      (theme: ThemeVariables) => {
        const gutter = name === Gutter.default;
        return (
          `margin-top:${ val && (gutter || name === Gutter.top) ? theme.typography.gutterTop : 0 }em;` +
          `margin-bottom:${ val && (gutter || name === Gutter.bottom) ? theme.typography.gutterBottom : 0 }em;`
        );
      },
      this.elementRef.nativeElement,
      instance,
      STYLE_PRIORITY
    );
  }
}
