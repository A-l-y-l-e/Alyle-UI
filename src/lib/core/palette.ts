import {
  Injectable, NgModule,
  ModuleWithProviders,
  Optional, Input }                  from '@angular/core';

import { Observable }         from 'rxjs/Rx';
import { Subject }            from 'rxjs/Subject';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { AlyleServiceConfig } from './alyle-config-service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { defaultTheme } from './default-theme';
import { GradStop } from './grad-stop/index';
import * as objectAssignDeep_ from 'deep-assign';
const objectAssignDeep: any = (<any>objectAssignDeep_.default || objectAssignDeep_);
export class ThemeColor {
  name: string;
  color: { [key: string]: string };
  contrast: 'light' | 'dark';
}
export interface Scheme {
  name: 'light' | 'dark';
  colorContrast: string;
}
/**
 * DEPRECATED
 */
export function themeProperty(color: string): boolean {
  return color === 'primary' || color === 'accent' || color === 'other';
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

@Injectable()
export class LyTheme {
  /* tslint:disable */
  AlyleUI: {currentTheme: AlyleServiceConfig, palette: any};
  /* tslint:enable */
  primary: Subject<any>;
  accent: Subject<any>;
  other: Subject<any>;
  palette: Subject<any>;
  scheme: Subject<any>;
  typography: Subject<any>;
  shade: Subject<string>;
  /**
   * OBSOLETO
   */
  colors: ThemeColor[] =
  [
    {
      name: 'pink',
      color: { '500': '#ff4b73' },
      contrast: 'light'
    },
    {
      name: 'pinkLight',
      color: { '500': '#f50057' },
      contrast: 'light'
    },
    {
      name: 'cyan',
      color: { '500': '#00bcd4' },
      contrast: 'light'
    },
    {
      name: 'red',
      color: { '500': '#FF5252' },
      contrast: 'light'
    },
    {
      name: 'amber',
      color: { '500': '#ffc107' },
      contrast: 'dark'
    },
    {
      name: 'teal',
      color: { '500': '#009688' },
      contrast: 'light'
    },
    {
      name: 'purple',
      color: { '500': '#ce30c9' },
      contrast: 'light'
    },
    {
      name: 'lightBlue',
      color: { '500': '#03A9F4' },
      contrast: 'light'
    },
    {
      name: 'blue',
      color: { '500': '#2196F3' },
      contrast: 'light'
    },
    {
      name: 'deepOrange',
      color: { '500': '#FF5722' },
      contrast: 'light'
    },
  ];
  private findColor(data: string) {
    const colors = this.colors.find((_: any) => _.name === data);
    if (colors) {
      return colors;
    } else {
      return new ThemeColor();
    }

  }
  private sanitizerStyle(val: any): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(val);
  }

  private _setColorPalette(key: string, palette: any): any {
    let colors = palette[key];
    if (colors) {
      if (Object.keys(colors).length <= 2) {
        /**get color of first item  */
        const shades = this.createShades(colors[(Object.keys(colors)[0])]);
        colors = objectAssignDeep(colors, shades);
      }
      return colors;
    } else {
      throw new Error(`${key} not found in palette`);
    }
  }

  constructor(@Optional() config: AlyleServiceConfig, private sanitizer: DomSanitizer) {

    config = objectAssignDeep(defaultTheme as AlyleServiceConfig, config);
    const primary    = this._setColorPalette(config.primary, config.palette);
    const accent     = this._setColorPalette(config.accent, config.palette);
    const other      = this._setColorPalette(config.other, config.palette);
    const shade      = config.shade;
    const scheme     = config.schemes[config.colorScheme];
    const typography = config.typography;
    // if (config.palette) {
    //   if (config.palette[config.primary]) {
    //     primary = config.palette[config.primary];
    //   }
    //   if (config.palette[config.accent]) {
    //     accent = config.palette[config.accent];
    //   }
    //   if (config.palette[config.other]) {
    //     other = config.palette[config.other];
    //   }
    // }

    let getAllColors = {
      primary: primary,
      accent: accent,
      other: other,
      // colorText: {color: scheme.text.default},
      // bgText: {color: scheme.background.default}
    };
    getAllColors = objectAssignDeep(getAllColors, scheme);

    // this.createShades(primary.color[shade]);
    /* tslint:disable */
    this.AlyleUI = {
      currentTheme: config,
      palette: getAllColors,
    }
    /* tslint:enable */
    this.primary = new BehaviorSubject<any>(primary);
    this.accent = new BehaviorSubject<any>(accent);
    this.other = new BehaviorSubject<any>(other);
    this.scheme = new BehaviorSubject<any>(scheme);
    this.typography = new BehaviorSubject<any>(typography);
    this.shade = new BehaviorSubject<any>(shade);
    this.palette = new BehaviorSubject<any>(getAllColors);

  }

  // private addShades(primary, accent, other) {
  //   this.createShades(primary.color[shade]);
  // }

  private _gradStop(colors: string[], stops) {
    return new GradStop({
      stops: stops,
      inputFormat: 'hex',
      colorArray: colors
    }).getColors();
  }
  private _getGrad(color: string) {
    const toBlack = this._gradStop(['#fff', color], 11);
    const toWhite = this._gradStop([color, '#000'], 33);
    toBlack.pop();
    return toBlack.concat(toWhite);
  }

  createShades(color: string) {
    const ar = this._getGrad(color);
    const shades = {};
    ar.forEach((a, b) => {
      const shadeId = `${b * 100 / 2}`;
      if (b <= 20) {
        shades[shadeId] = a;
        // console.log(`%c    ${shadeId}`, `background: ${a}; color: #fff`);
      }
    });
    return shades;
  }

  setTheme(config: AlyleServiceConfig) {
    const currentTheme = this.AlyleUI.currentTheme;
    config = objectAssignDeep(currentTheme as AlyleServiceConfig, config);
    if (config) {
      const primary    = this._setColorPalette(config.primary, config.palette);
      const accent     = this._setColorPalette(config.accent, config.palette);
      const other      = this._setColorPalette(config.other, config.palette);
      const shade      = config.shade;
      const scheme     = config.schemes[config.colorScheme];
      const typography = config.typography;

      let getAllColors = {
        primary: primary,
        accent: accent,
        other: other
      };
      getAllColors = objectAssignDeep(getAllColors, scheme);

      // this.createShades(primary.color[shade]);

      /* tslint:disable */
      this.AlyleUI = {
        currentTheme: config,
        palette: getAllColors
      }
      /* tslint:enable */
      this.primary.next(primary);
      this.accent.next(accent);
      this.other.next(other);
      this.scheme.next(scheme);
      this.typography.next(typography);
      this.shade.next(shade);
      this.palette.next(getAllColors);
    }
  }


  /**
   * for bg or color inputs, find the color in palette, return color
   * @param  {'bg' |      'color'}     type [description]
   * @param  {string}  color  Palette name
   * @return {string}         Color hex
   */
  color(color: string, colors?: any, shade?: string): string {
    console.warn('DEPRECATED');
    const $shade = shade ? shade : this.AlyleUI.currentTheme.shade;
    let result: string;
    result = this.getColorv2(color, colors, $shade);
    return result;
  }
  /**
   * get color of `string` in palette
   * @param value
   */
  colorOf(value: string): string {
    const theme = this.AlyleUI.palette;
    const shade = this.AlyleUI.currentTheme.shade;
    if (themeProperty(value)) {
      return theme[value][shade];
    } else {
      let current = theme;
      const values = value.split(/:/);
      values.forEach((item, index) => {
        if (current[item]) {
          current = current[item];
        } else if (index > 0) {
          throw new Error(`\n\n>>>\`${value}\` undefined in LyTheme\n`);
        }
      });
      if (typeof current === 'object') {
        current = value;
      }
      return current;
    }
  }

  private getColorv2(colorName: string, colors: any, shade?: string): string {
    const ar = colors ? colors : this.AlyleUI.palette;
    if (ar[colorName]) {
      if (typeof ar[colorName].color == 'string' || typeof ar[colorName] == 'string') {
        return ar[colorName].color || ar[colorName];
      } else {
        return ar[colorName].color[shade];
      }
    } else {
      return colorName;
    }
  }

  /**
   * Get palette from theme
   * @param  {string} colorName name of palette
   * @return {Color}
   */
  paletteOf(colorName: string): ThemeColor {
    return this.findColor(colorName);
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
  constructor(public theme: LyTheme) {}
  /**
   * for bg or color inputs, find the color in palette, return color
   * example: this.theme.update('bg', 'primary', this.theme.AlyleUI.palette); // #00bcd4
   * @param  {'bg' |      'color'}     type [description]
   * @param  {string}  color  Palette name
   * @return {string}         Color hex
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
