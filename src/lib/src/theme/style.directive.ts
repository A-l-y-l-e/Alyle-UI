import { Directive, Input } from '@angular/core';
import { lyl } from '../parse';
import { eachMedia } from '../style-utils';
import { StyleRenderer, Style, WithStyles, InputStyle } from '../minimal/renderer-style';
import { ThemeVariables } from './theme-config';

const STYLE_PRIORITY = -0.5;

/**
 * @dynamic
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
  selector: `[lyStyle],
              [p], [pf], [pe], [pt], [pb], [px], [py],
              [m], [mf], [me], [mt], [mb], [mx], [my],
              [size],
              [width], [maxWidth], [minWidth],
              [height], [maxHeight], [minHeight],
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
  ]
})
export class LyStyle implements WithStyles {
  /** @docs-private */
  static readonly и = 'LyStyle';
  static readonly $priority = STYLE_PRIORITY;

  @Input()
  @Style<string | number | null>(
    (value, media) => ({breakpoints}: ThemeVariables) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          padding: ${to8Px(value)}
        }
      }`
    )
  ) p: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints, after}) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          padding-${after}: ${to8Px(val)}
        }
      }`
    ), true)
  ) pf: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints, before}) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          padding-${before}: ${to8Px(val)}
        }
      }`
    ), true)
  ) pe: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              padding-top: ${to8Px(val)}
            }
          }`
        ), true)
  ) pt: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              padding-bottom: ${to8Px(val)}
            }
          }`
        ), true)
  ) pb: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              padding: 0 ${to8Px(val)}
            }
          }`
        ), true)
  ) px: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              padding: ${to8Px(val)} 0
            }
          }`
        ), true)
  ) py: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin: ${to8Px(val)}
            }
          }`
        ), true)
  ) m: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints, after}) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin-${after}: ${to8Px(val)}
            }
          }`
        ), true)
  ) mf: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints, before}) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin-${before}: ${to8Px(val)}
            }
          }`
        ), true)
  ) me: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin-top: ${to8Px(val)}
            }
          }`
        ), true)
  ) mt: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin-bottom: ${to8Px(val)}
            }
          }`
        ), true)
  ) mb: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin: 0 ${to8Px(val)}
            }
          }`
        ), true)
  ) mx: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              margin: ${to8Px(val)} 0
            }
          }`
        ), true)
  ) my: string | number | null;

  static readonly with: InputStyle<string | number | null>;
  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          width: ${transform(val)}
        }
      }`
    ), true)
  ) width: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          max-width: ${transform(val)}
        }
      }`
    ), true)
  ) maxWidth: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          min-width: ${transform(val)}
        }
      }`
    ), true)
  ) minWidth: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          height: ${transform(val)}
        }
      }`
    ), true)
  ) height: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          max-height: ${transform(val)}
        }
      }`
    ), true)
  ) maxHeight: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          min-height: ${transform(val)}
        }
      }`
    ), true)
  ) minHeight: string | number | null;

  @Input()
  set size(value: string | number | null) {
    this.width = value;
    this.height = value;
  }

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          display: ${val}
        }
      }`
    ), true)
  ) display: string | null;


  // Flexbox

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex: ${val}
        }
      }`
    ), true)
  ) flex: string | number | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex-basis: ${val}
        }
      }`
    ), true)
  ) flexBasis: string | number | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex-direction: ${val}
        }
      }`
    ), true)
  ) flexDirection: string | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex-grow: ${val}
        }
      }`
    ), true)
  ) flexGrow: string | number | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex-self: ${val}
        }
      }`
    ), true)
  ) flexSelf: string | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex-shrink: ${val}
        }
      }`
    ), true)
  ) flexShrink: string | number | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          flex-wrap: ${val}
        }
      }`
    ), true)
  ) flexWrap: string | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          justify-content: ${val}
        }
      }`
    ), true)
  ) justifyContent: string | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          justify-items: ${val}
        }
      }`
    ), true)
  ) justifyItems: string | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          justify-self: ${val}
        }
      }`
    ), true)
  ) justifySelf: string | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          align-content: ${val}
        }
      }`
    ), true)
  ) alignContent: string | null;

  @Input()
  @Style<string | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          align-items: ${val}
        }
      }`
    ), true)
  ) alignItems: string | null;

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          order: ${val}
        }
      }`
    ), true)
  ) order: string | number | null;

  @Input()
  @Style<string | number | null>(
    (value, media) => ({breakpoints}: ThemeVariables) => (
      lyl `{
        @media ${(media && (breakpoints[media] || media)) || 'all'} {
          ${value}
        }
      }`
    )
  )
  lyStyle: string | null;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

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
