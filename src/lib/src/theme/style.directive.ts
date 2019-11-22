import { Directive, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { StyleCollection, lyl, StyleTemplate } from '../parse';
import { eachMedia } from '../style-utils';
import { LyHostClass } from '../minimal/host-class';
import { StyleRenderer } from '../minimal/renderer-style';
import { ThemeRef } from './theme2.service';

const STYLE_PRIORITY = -0.5;

@Directive({
  selector: `lyStyle,
              [p], [pf], [pe], [pt], [pb], [px], [py],
              [m], [mf], [me], [mt], [mb], [mx], [my],
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
  @Input() px: number;
  @Input() py: number;
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
    index: number,
    styleId: string,
    simpleChange: SimpleChange,
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ) {
    if (simpleChange) {
      const { currentValue } = simpleChange;
      if (currentValue != null) {
        this[index] = this._sr.add(
          `${LyStyle.и}--${styleId}-${currentValue}`,
          style,
          STYLE_PRIORITY, this[index]
        );
      } else {
        this._hClass.remove(this[index]);
      }
    }
  }

  ngOnChanges({p, pf, pe, pt, pb, px, py, m, mf, me, mt, mb, mx, my}: SimpleChanges) {
    if (p) {
      const { currentValue } = p;
      this._updateStyle(
        0x1,
        'p',
        p,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding: ${toPaddingVal(val)}
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
              padding-${after}: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pe) {
      const { currentValue } = pe;
      this._updateStyle(
        0x3,
        'pe',
        pe,
        ({before}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-${before}: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pt) {
      const { currentValue } = pt;
      this._updateStyle(
        0x4,
        'pt',
        pt,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-top: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (pb) {
      const { currentValue } = pb;
      this._updateStyle(
        0x5,
        'pb',
        pb,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding-bottom: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (px) {
      const { currentValue } = px;
      this._updateStyle(
        0x6,
        'px',
        px,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding: 0 ${typeof val === 'number'
              ? val * 8 + 'px'
              : val}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (py) {
      const { currentValue } = py;
      this._updateStyle(
        0x7,
        'py',
        py,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding: ${typeof val === 'number'
              ? val * 8 + 'px'
              : val} 0
            }
          }`
        ), new StyleCollection())
      );
    }

    if (m) {
      const { currentValue } = m;
      this._updateStyle(
        0x8,
        'm',
        m,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (mf) {
      const { currentValue } = mf;
      this._updateStyle(
        0x9,
        'mf',
        mf,
        ({after}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin-${after}: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (me) {
      const { currentValue } = me;
      this._updateStyle(
        0x10,
        'me',
        me,
        ({before}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin-${before}: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (mt) {
      const { currentValue } = mt;
      this._updateStyle(
        0x11,
        'mt',
        mt,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin-top: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (mb) {
      const { currentValue } = mb;
      this._updateStyle(
        0x12,
        'mb',
        mb,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin-bottom: ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (mx) {
      const { currentValue } = mx;
      this._updateStyle(
        0x13,
        'mx',
        mx,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin: 0 ${toPaddingVal(val)}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (my) {
      const { currentValue } = my;
      this._updateStyle(
        0x14,
        'my',
        my,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              margin: ${toPaddingVal(val)} 0
            }
          }`
        ), new StyleCollection())
      );
    }

  }
}

/**
 * Convert to px if the value is a number, otherwise leave it as is
 * @docs-private
 */
function toPaddingVal(val: number | string) {
  return typeof val === 'number'
    ? `${val * 8}px`
    : val;
}
