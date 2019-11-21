import { Directive, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { StyleCollection, lyl, StyleTemplate } from '../parse';
import { eachMedia } from '../style-utils';
import { LyHostClass } from '../minimal/host-class';
import { StyleRenderer } from '../minimal/renderer-style';
import { ThemeRef } from './theme2.service';

const STYLE_PRIORITY = -0.5;

@Directive({
  selector: `lyStyle,
              [p], [px], [py], [pf], [pe], [pt], [pb],
              [m], [mx], [my], [mf], [me], [mt], [mb],
              [display]`,
  providers: [
    LyHostClass,
    StyleRenderer
  ]
})
export class LyStyle {
  /** @docs-private */
  static readonly и = 'LyStyle';

  @Input() p: number | string;
  @Input() pf: number;
  @Input() pe: number;
  @Input() pt: number;
  @Input() pb: number;
  @Input() m: number;
  @Input() mf: number;
  @Input() me: number;
  @Input() mt: number;
  @Input() mb: number;

  constructor(
    private _sr: StyleRenderer,
    private _hClass: LyHostClass
  ) { }

  private _updateStyle(
    classId: number,
    styleId: string,
    simpleChange: SimpleChange,
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ) {
    if (simpleChange) {
      const { currentValue } = simpleChange;
      if (currentValue != null) {
        this[classId] = this._sr.add(
          `${LyStyle.и}--${styleId}-${currentValue}`,
          style,
          STYLE_PRIORITY, this[classId]
        );
      } else {
        this._hClass.remove(this[classId]);
      }
    }
  }

  ngOnChanges({p, pf, pe, pt, pb}: SimpleChanges) {
    if (p) {
      const { currentValue } = p;
      this._updateStyle(
        0x1,
        'p',
        p,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding: ${typeof val === 'number'
                ? val * 8 + 'px'
                : val}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pf) {
      const { currentValue } = pf;
      this._updateStyle(
        0x2,
        'pf',
        pf,
        ({after}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-${after}: ${typeof val === 'number'
                ? val * 8 + 'px'
                : val}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pe) {
      const { currentValue } = pe;
      this._updateStyle(
        0x2,
        'pe',
        pe,
        ({before}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-${before}: ${typeof val === 'number'
                ? val * 8 + 'px'
                : val}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pt) {
      const { currentValue } = pt;
      this._updateStyle(
        0x2,
        'pt',
        pt,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-top: ${typeof val === 'number'
                ? val * 8 + 'px'
                : val}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pb) {
      const { currentValue } = pb;
      this._updateStyle(
        0x2,
        'pb',
        pb,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-bottom: ${typeof val === 'number'
                ? val * 8 + 'px'
                : val}
            }
          }`
        ), new StyleCollection())
      );
    }

  }
}
