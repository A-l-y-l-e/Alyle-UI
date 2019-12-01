import { Directive, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { StyleCollection, lyl, StyleTemplate } from '../parse';
import { eachMedia } from '../style-utils';
import { LyHostClass } from '../minimal/host-class';
import { StyleRenderer } from '../minimal/renderer-style';
import { ThemeRef } from './theme2.service';

const STYLE_PRIORITY = -0.5;

@Directive({
  selector: `[lyStyle]
              [p], [pf], [pe], [pt], [pb], [px], [py],
              [m], [mf], [me], [mt], [mb], [mx], [my],
              [display],
              [width]`,
  providers: [
    LyHostClass,
    StyleRenderer
  ]
})
export class LyStyle {
  /** @docs-private */
  static readonly и = 'LyStyle';

  @Input() p:  string | number | null;
  @Input() pf: string | number | null;
  @Input() pe: string | number | null;
  @Input() pt: string | number | null;
  @Input() pb: string | number | null;
  @Input() px: string | number | null;
  @Input() py: string | number | null;
  @Input() m:  string | number | null;
  @Input() mf: string | number | null;
  @Input() me: string | number | null;
  @Input() mt: string | number | null;
  @Input() mb: string | number | null;
  @Input() mx: string | number | null;
  @Input() my: string | number | null;
  @Input() display: string | null;
  @Input() width: string | number | null;

  @Input()
  get lyStyle() {
    return this._lyStyle;
  }
  set lyStyle(val: string | ((theme: any, ref: ThemeRef) => StyleTemplate) | null) {
    if (typeof val === 'function') {
      this._sr.add(val);
    } else {
      this._updateStyle(
        0xa,
        'style',
        val,
        () => eachMedia(val!, (v, media) => (
          lyl `{
            @media ${media || 'all'} {
              ${v}
            }
          }`
        ), new StyleCollection())
      );
    }
  }
  private _lyStyle: string | null;

  constructor(
    private _sr: StyleRenderer,
    private _hClass: LyHostClass
  ) { }

  private _updateStyle(
    index: number,
    styleId: string,
    simpleChange: SimpleChange | string | number | null,
    style: (theme: any, ref: ThemeRef) => StyleTemplate
  ) {
    if (simpleChange) {
      const currentValue = simpleChange instanceof SimpleChange
        ? simpleChange.currentValue
        : simpleChange;
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

  ngOnChanges({p, pf, pe, pt, pb, px, py, m, mf, me, mt, mb, mx, my, display, width}: SimpleChanges) {
    if (p) {
      const { currentValue } = p;
      this._updateStyle(
        0x1,
        'p',
        p,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              padding: ${to8Px(val)}
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
              padding-${after}: ${to8Px(val)}
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
              padding-${before}: ${to8Px(val)}
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
              padding-top: ${to8Px(val)}
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
              padding-bottom: ${to8Px(val)}
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
              margin: ${to8Px(val)}
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
              margin-${after}: ${to8Px(val)}
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
              margin-${before}: ${to8Px(val)}
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
              margin-top: ${to8Px(val)}
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
              margin-bottom: ${to8Px(val)}
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
              margin: 0 ${to8Px(val)}
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
              margin: ${to8Px(val)} 0
            }
          }`
        ), new StyleCollection())
      );
    }

    if (display) {
      const { currentValue } = display;
      this._updateStyle(
        0x15,
        'display',
        display,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              display: ${val}
            }
          }`
        ), new StyleCollection())
      );
    }

    if (width) {
      const { currentValue } = width;
      this._updateStyle(
        0x16,
        'width',
        width,
        () => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${media || 'all'} {
              width: ${transform(val)}
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
function to8Px(val: number | string) {
  return typeof val === 'number'
    ? `${val * 8}px`
    : val;
}

function transform(value) {
  return value <= 1 ? `${value * 100}%` : value;
}
