import { Directive, ElementRef, Renderer2, Input, isDevMode, OnInit } from '@angular/core';
import { LyTheme2, toBoolean } from '@alyle/ui';

const styles = ({
  root: {
    margin: 0,
    display: 'block'
  }
});

enum Gutter {
  default,
  top,
  bottom,
}

@Directive({
  selector: `[lyTyp]`
})
export class LyTypography implements OnInit {
  classes = this.style.addStyleSheet(styles, 'lyTyp', -1);
  private _lyTyp: string;
  private _lyTypClass: string;

  private _gutter: boolean;
  private _gutterClass: string;

  private _gutterTop: boolean;
  private _gutterTopClass: string;

  private _gutterBottom: boolean;
  private _gutterBottomClass: string;

  @Input()
  set lyTyp(val: string) {
    if (val !== this.lyTyp) {
      this._lyTypClass = this._createTypClass(val, this._lyTypClass);
    }
  }
  get lyTyp() {
    return this._lyTyp;
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

  private _createTypClass(key: string, instance: string) {
    const newKey = `k-typ:${key}`;

    return this.style.addStyle(newKey,
      theme => {
        const { typography } = theme;
        const { fontSize, fontWeight, letterSpacing, textTransform, lineHeight } = typography[key || 'body1'];
        let style = (
          `font-size:${theme.pxToRem(fontSize)};` +
          `font-weight:${fontWeight};` +
          `letter-spacing:${theme.pxToRem(letterSpacing)};`
        );
        if (lineHeight) {
          style += `line-height:${theme.pxToRem(lineHeight)};`;
        }
        if (textTransform) {
          style += `text-transform:${textTransform};`;
        }
        return style;
      },
      this.elementRef.nativeElement,
      instance
    );
  }

  private _createGutterClass(name: Gutter, val: boolean, instance: string) {
    return this.style.addStyle(
      `k-typ-gutter:${name}:${val}`,
      theme => {
        const gutter = name === Gutter.default;
        return (
          `margin-top:${ val && (gutter || name === Gutter.top) ? theme.typography.gutterTop : 0 }em;` +
          `margin-bottom:${ val && (gutter || name === Gutter.bottom) ? theme.typography.gutterBottom : 0 }em;`
        );
      },
      this.elementRef.nativeElement, instance
    );
  }
}
