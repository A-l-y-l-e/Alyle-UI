import { Directive, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { StyleCollection, lyl, StyleTemplate } from '../parse';
import { eachMedia } from '../style-utils';
import { LyHostClass } from '../minimal/host-class';
import { StyleRenderer } from '../minimal/renderer-style';
import { ThemeRef } from './theme2.service';
import { ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -0.5;

@Directive({
  selector: `[lyStyle],
              [p], [pf], [pe], [pt], [pb], [px], [py],
              [m], [mf], [me], [mt], [mb], [mx], [my],
              [display],
              [maxWidth],
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
  @Input() maxWidth: string | number | null;

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
        ({breakpoints}: ThemeVariables) => eachMedia(val!, (v, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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

  ngOnChanges({p,
    pf,
    pe,
    pt,
    pb,
    px,
    py,
    m,
    mf,
    me,
    mt,
    mb,
    mx,
    my,
    display,
    width,
    maxWidth
  }: SimpleChanges) {
    if (p) {
      const { currentValue } = p;
      this._updateStyle(
        0x1,
        'p',
        p,
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints, after}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints, before}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints, after}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints, before}) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
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
        ({breakpoints}: ThemeVariables) => eachMedia(currentValue, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              display: ${val}
            }
          }`
        ), new StyleCollection())
      );
    }

    this._updateStyle(
      0x16,
      'width',
      width,
      ({breakpoints}: ThemeVariables) => eachMedia(width.currentValue, (val, media) => (
        lyl `{
          @media ${(media && breakpoints[media]) || 'all'} {
            width: ${transform(val)}
          }
        }`
      ), new StyleCollection())
    );

    this._updateStyle(
      0x17,
      'maxWidth',
      maxWidth,
      ({breakpoints}: ThemeVariables) => eachMedia(maxWidth.currentValue, (val, media) => (
        lyl `{
          @media ${(media && breakpoints[media]) || 'all'} {
            max-width: ${transform(val)}
          }
        }`
      ), new StyleCollection())
    );

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

function transform(value: number | string) {
  return value <= 1
    ? `${value as number * 100}%`
    : value;
}
