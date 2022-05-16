import { Directive, ElementRef, SimpleChanges, OnChanges, isDevMode } from '@angular/core';
import { lyl } from '../parse';
import { StyleRenderer, Style, WithStyles, InputStyle, Style2 } from '../minimal/renderer-style';
import { ThemeVariables } from './theme-config';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { shadowBuilder } from '../shadow';

const STYLE_PRIORITY = -0.5;

/**
 * @dynamic
 */
@Directive({
  selector: `[lyStyle],
              [lyColor],
              [lyBg],
              [lyP], [lyPf], [lyPe], [lyPt], [lyPb], [lyPx], [lyPy],
              [lyM], [lyMf], [lyMe], [lyMt], [lyMb], [lyMx], [lyMy],
              [lySize],
              [lyWidth], [lyMaxWidth], [lyMinWidth],
              [lyHeight], [lyMaxHeight], [lyMinHeight],
              [lyDisplay],
              [lyFlex],
              [lyFlexBasis],
              [lyFlexDirection],
              [lyFlexGrow],
              [lyFlexSelf],
              [lyFlexShrink],
              [lyFlexWrap],
              [lyJustifyContent],
              [lyJustifyItems],
              [lyJustifySelf],
              [lyAlignContent],
              [lyAlignItems],
              [lyOrder]`,
  providers: [
    StyleRenderer
  ],
  inputs: [
    'lyStyle',
    'color: lyColor',
    'bg: lyBg',
    'p: lyP', 'pf: lyPf', 'pe: lyPe', 'pt: lyPt', 'pb: lyPb', 'px: lyPx', 'py: lyPy',
    'm: lyM', 'mf: lyMf', 'me: lyMe', 'mt: lyMt', 'mb: lyMb', 'mx: lyMx', 'my: lyMy',
    'size: lySize',
    'width: lyWidth', 'maxWidth: lyMaxWidth', 'minWidth: lyMinWidth',
    'height: lyHeight', 'maxHeight: lyMaxHeight', 'minHeight: lyMinHeight',
    'display: lyDisplay',
    'flex: lyFlex',
    'flexBasis: lyFlexBasis',
    'flexDirection: lyFlexDirection',
    'flexGrow: lyFlexGrow',
    'flexSelf: lyFlexSelf',
    'flexShrink: lyFlexShrink',
    'flexWrap: lyFlexWrap',
    'justifyContent: lyJustifyContent',
    'justifyItems: lyJustifyItems',
    'justifySelf: lyJustifySelf',
    'alignContent: lyAlignContent',
    'alignItems: lyAlignItems',
    'order: lyOrder',
    'elevation: lyElevation'
  ]
})
export class LyStyle implements WithStyles {

  set size(value: string | number | null) {
    this.width = value;
    this.height = value;
  }

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
  /** @docs-private */
  static readonly и = 'LyStyle';
  static readonly $priority = STYLE_PRIORITY;

  static readonly with: InputStyle<string | number | null>;

  @Style<string | null>(
    (value) => (theme: ThemeVariables) => (
      lyl `{
        color: ${theme.colorOf(value)}
      }`
    )
  ) color: string | number | null;

  @Style<string | null>(
    (value) => (theme: ThemeVariables) => (
      lyl `{
        background: ${theme.colorOf(value)}
      }`
    )
  ) bg: string | number | null;

  @Style<string | number | null>(
    (value, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding: ${to8Px(value)}
        }
      }`
    )
  ) p: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints, after }) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding-${after}: ${to8Px(val)}
        }
      }`
    )
  ) pf: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints, before }) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding-${before}: ${to8Px(val)}
        }
      }`
    )
  ) pe: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding-top: ${to8Px(val)}
        }
      }`
    )
  ) pt: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding-bottom: ${to8Px(val)}
        }
      }`
    )
  ) pb: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding: 0 ${to8Px(val)}
        }
      }`
    )
  ) px: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          padding: ${to8Px(val)} 0
        }
      }`
    )
  ) py: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          margin: ${to8Px(val)}
        }
      }`
    )
  ) m: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints, after }) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          margin-${after}: ${to8Px(val)}
        }
      }`
    )
  ) mf: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints, before }) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          margin-${before}: ${to8Px(val)}
        }
      }`
    )
  ) me: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          margin-top: ${to8Px(val)}
        }
      }`
    )
  ) mt: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
            @media ${(media && breakpoints[ media ]) || 'all'} {
              margin-bottom: ${to8Px(val)}
            }
          }`
    )
  ) mb: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
            @media ${(media && breakpoints[ media ]) || 'all'} {
              margin: 0 ${to8Px(val)}
            }
          }`
    )
  ) mx: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
            @media ${(media && breakpoints[ media ]) || 'all'} {
              margin: ${to8Px(val)} 0
            }
          }`
    )
  ) my: string | number | null;
  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          width: ${transform(val)}
        }
      }`
    )
  ) width: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          max-width: ${transform(val)}
        }
      }`
    )
  ) maxWidth: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          min-width: ${transform(val)}
        }
      }`
    )
  ) minWidth: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          height: ${transform(val)}
        }
      }`
    )
  ) height: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          max-height: ${transform(val)}
        }
      }`
    )
  ) maxHeight: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          min-height: ${transform(val)}
        }
      }`
    )
  ) minHeight: string | number | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          display: ${val}
        }
      }`
    )
  ) display: string | null;


  // Flexbox

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex: ${val}
        }
      }`
    )
  ) flex: string | number | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex-basis: ${val}
        }
      }`
    )
  ) flexBasis: string | number | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex-direction: ${val}
        }
      }`
    )
  ) flexDirection: string | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex-grow: ${val}
        }
      }`
    )
  ) flexGrow: string | number | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex-self: ${val}
        }
      }`
    )
  ) flexSelf: string | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex-shrink: ${val}
        }
      }`
    )
  ) flexShrink: string | number | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          flex-wrap: ${val}
        }
      }`
    )
  ) flexWrap: string | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          justify-content: ${val}
        }
      }`
    )
  ) justifyContent: string | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          justify-items: ${val}
        }
      }`
    )
  ) justifyItems: string | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          justify-self: ${val}
        }
      }`
    )
  ) justifySelf: string | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          align-content: ${val}
        }
      }`
    )
  ) alignContent: string | null;

  @Style<string | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          align-items: ${val}
        }
      }`
    )
  ) alignItems: string | null;

  @Style<string | number | null>(
    (val, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && breakpoints[ media ]) || 'all'} {
          order: ${val}
        }
      }`
    )
  ) order: string | number | null;

  @Style<string | number | null>(
    (value, media) => ({ breakpoints }: ThemeVariables) => (
      lyl`{
        @media ${(media && (breakpoints[ media ] || media)) || 'all'} {
          ${value}
        }
      }`
    )
  )
  lyStyle: string | null;

  @Style2<string | number>(
    (value: number, media) => ({ breakpoints, shadow }: ThemeVariables) => (
      lyl `{
        @media ${(media && (breakpoints[ media ] || media)) || 'all'} {
          box-shadow: ${shadowBuilder(value, shadow)}
        }
      }`
    ),
    coerceNumberProperty
  )
  elevation: NumberInput;

}

/**
 * @dynamic
 * @deprecated
 * Spacing
 * [p], [pf], [pe], [pt], [pb], [px], [py],
 * [m], [mf], [me], [mt], [mb], [mx], [my],
 * Sizing
 * [size],
 * [width], [maxWidth], [minWidth],
 * [height], [maxHeight], [minHeight],
 * Others
 * [lyStyle]
 */
@Directive({
  selector: `
              [p], [pf], [pe], [pt], [pb], [px], [py],
              [m], [mf], [me], [mt], [mb], [mx], [my],
              [size]:not([ly-button]),
              [width]:not(svg):not(canvas):not(embed):not(iframe):not(img):not(input):not(object):not(video),
              [maxWidth], [minWidth],
              [height]:not(svg):not(canvas):not(embed):not(iframe):not(img):not(input):not(object):not(video),
              [maxHeight], [minHeight],
              [display],
              [flex],
              [flexBasis],
              [flexDirection],
              [flexGrow],
              [flexSelf],
              [flexShrink],
              [flexWrap],
              [justifyContent],
              [justifyItems],
              [justifySelf],
              [alignContent],
              [alignItems],
              [order]`,
  providers: [
    StyleRenderer
  ],
  inputs: [
    'p', 'pf', 'pe', 'pt', 'pb', 'px', 'py',
    'm', 'mf', 'me', 'mt', 'mb', 'mx', 'my',
    'size',
    'width', 'maxWidth', 'minWidth',
    'height', 'maxHeight', 'minHeight',
    'display',
    'flex',
    'flexBasis',
    'flexDirection',
    'flexGrow',
    'flexSelf',
    'flexShrink',
    'flexWrap',
    'justifyContent',
    'justifyItems',
    'justifySelf',
    'alignContent',
    'alignItems',
    'order',
  ]
})
export class LyStyleDeprecated extends LyStyle implements OnChanges {
  constructor(
    sRenderer: StyleRenderer,
    private _el: ElementRef
  ) {
    super(sRenderer);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (isDevMode()) {
      for (const key in changes) {
        if (changes.hasOwnProperty(key)) {
          const message = `[${key}] is deprecated, use [ly${key.charAt(0).toUpperCase() + key.slice(1)}] instead.`;
          console.warn({
            message,
            element: this._el.nativeElement
          });
        }
      }
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
    : val.includes(' ')
      ? val.split(' ').map(_ => strTo8Px(_)).join(' ')
      : strTo8Px(val);
}

function strTo8Px(val: string) {
  const num = +val;
  return isNaN(num) ? val : `${num * 8}px`;
}

function strToPx(val: string) {
  const num = +val;
  return isNaN(num) ? val : `${num}px`;
}

function transform(value: number | string) {
  return value <= 1
    ? `${value as number * 100}%`
    : typeof value === 'number'
      ? `${value}px`
      : value.includes(' ')
        ? value.split(' ').map(_ => strToPx(_)).join(' ')
        : strToPx(value);
}
