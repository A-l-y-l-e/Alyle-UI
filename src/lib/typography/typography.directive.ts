import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
// import { IMinimaTheme } from '../themes';
import { LyTypographyClasses } from './typography.service';

@Directive({
  selector: `[lyTyp]`
})
export class LyTypography {
  private _lyTyp: string;
  private _lyTypClass: string;

  @Input()
  set lyTyp(val: string) {
    if (val !== this.lyTyp) {
      const newClass = this._createTypClass(val);
      this.style.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this._lyTypClass);
      this._lyTypClass = newClass;
    }
  }
  get lyTyp() {
    return this._lyTyp;
  }
  constructor(
    private style: LyTheme2,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    classes: LyTypographyClasses
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, classes.root);
  }

  private _createTypClass(key: string) {
    const newKey = `k-typ:${key}`;

    return this.style.setUpStyleSecondary<any/** IMinimaTheme */>(newKey,
      theme => {
        const { typography } = theme;
        const { fontSize, fontWeight, letterSpacing, textTransform, lineHeight } = typography.typographyVariants[key || 'body1'];
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
      }
    );
  }

}
