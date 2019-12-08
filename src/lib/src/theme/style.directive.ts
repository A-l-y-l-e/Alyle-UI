import { Directive, Input } from '@angular/core';
import { lyl, StyleTemplate } from '../parse';
import { eachMedia } from '../style-utils';
import { StyleRenderer, Style, WithStyles } from '../minimal/renderer-style';
import { ThemeRef } from './theme2.service';
import { ThemeVariables } from './theme-config';

const STYLE_PRIORITY = -0.5;

/**
 * @dynamic
 */
@Directive({
  selector: `[lyStyle],
              [p], [pf], [pe], [pt], [pb], [px], [py],
              [m], [mf], [me], [mt], [mb], [mx], [my],
              [display],
              [maxWidth],
              [width]`,
  providers: [
    StyleRenderer
  ]
})
export class LyStyle implements WithStyles {
  /** @docs-private */
  static readonly и = 'LyStyle';

  @Input()
  @Style<string | number | null>(
    value => ({breakpoints}: ThemeVariables) => eachMedia(value, (val, media) => (
      lyl `{
        @media ${(media && breakpoints[media]) || 'all'} {
          padding: ${to8Px(val)}
        }
      }`
    ), true)
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
  get lyStyle() {
    return this._lyStyle;
  }
  set lyStyle(val: string | ((theme: any, ref: ThemeRef) => StyleTemplate) | null) {
    if (typeof val === 'function') {
      this.sRenderer.add(val);
    } else if (val != null) {
      this[0xa] = this.sRenderer.add(
        `${LyStyle.и}--style-${val}`,
        ({breakpoints}: ThemeVariables) => eachMedia(val!, (v, media) => (
          lyl `{
            @media ${(media && breakpoints[media]) || 'all'} {
              ${v}
            }
          }`
        ), true),
        STYLE_PRIORITY
      );
    } else {
      this.sRenderer.removeClass(this[0xa]);
    }
  }
  private _lyStyle: string | null;

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
    : val;
}

function transform(value: number | string) {
  return value <= 1
    ? `${value as number * 100}%`
    : value;
}
