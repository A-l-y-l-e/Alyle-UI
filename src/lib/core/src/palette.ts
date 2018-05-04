import {
  Injectable, NgModule,
  ModuleWithProviders,
  Optional, Input }                  from '@angular/core';

import { ThemeVariables } from './alyle-config-service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { defaultTheme } from './default-theme';
import { LyTheme } from './theme.service';

export interface Scheme {
  name: 'light' | 'dark';
  colorContrast: string;
}

export function getContrastYIQ(hexcolor) {
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export function getColor(colors: any, color: string, shade: string): string {
  if (colors[color]) {
    const shadeColor = colors[color].color;
    if (typeof shadeColor === 'string') {
      return colors[color].color;
    } else {
      return colors[color].color[shade];
    }
  } else {
    if (typeof color === 'string') {
      return color;
    } else {
      return color[shade];
    }
  }
}


export class BgAndColorStyle {
  bg: string;
  color: string;
  theme: LyTheme;
  styleBackground: string;
  styleColor: string;
}


@Injectable()
export class LyStyleTheme {
  constructor() {}
  /**
   * for bg or color inputs, find the color in palette, return color
   * example: this.theme.update('bg', 'primary', this.theme.AlyleUI.palette); // #00bcd4
   */
  // getPalette(color: string, colors?: any): string {
  //   let result: string;
  //   if (colors) {
  //     result = getColor(colors, color);
  //   } else {
  //     result = getColor(this.theme.AlyleUI.palette, color);
  //   }
  //   return result;
  // }
}
/**
 * -------------
 */
@Injectable()
export class LyPalette {
  private _style: any;
  private _primary: any = {
    name: 'none',
    color: '#fff',
    text: '#fff',
  };
  private _accent: any = {
    name: 'none',
    color: '#fff',
    text: '#fff',
  };
  private _other: any = {
    name: 'none',
    color: '#fff',
    text: '#fff',
  };
  private palette: any;
  themeApp: any = {
    light: {
      color: '#24292e',
      background: '#f5f5f5',
    },
    dark: {
      color: '#f5f5f5',
      background: '#2C2D31',
    },
  };
  text: any = {
    default: 'rgba(0, 0, 0, 0.75)',
    light: '#fff',
    dark: '#2C2D31',
  };

}
