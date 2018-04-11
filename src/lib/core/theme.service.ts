import { Injectable, Optional, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defaultTheme } from './default-theme';
import { AlyleServiceConfig } from './alyle-config-service';
import { Subject } from 'rxjs/Subject';
import { gradStop } from './gradstop';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

let classId = 0;
let themeId = 1111;
export class ThemeColor {
  name: string;
  color: { [key: string]: string };
  contrast: 'light' | 'dark';
}

/**
 * DEPRECATED
 */
export function themeProperty(color: string): boolean {
  return color === 'primary' || color === 'accent' || color === 'other';
}

@Injectable()
export class LyTheme {
  renderer: Renderer2;
  Id: string;
  containerStyle;
  auiRef;
  _styleMap = new Map<string, StyleData>();
  AlyleUI: {currentTheme: AlyleServiceConfig, palette: any};
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
      if (Object.keys(colors).length <= 3) {
        /**get color of first item  */
        const shades = this.createShades(colors[(Object.keys(colors)[0])]);
        colors = mergeDeep(colors, shades);
      }
      return colors;
    } else {
      throw new Error(`${key} not found in palette`);
    }
  }

  /** get class name of color */
  getClassKey(color: string, of: 'color' | 'bg') {
    return `${this.Id}-${color.replace(':', '__')}-${of}`;
  }

  private updateStyle() {
    const beforeStyle = this.containerStyle;
    const newStyle = this.renderer.createElement('style');
    // (<string[]>this.AlyleUI.palette.primary).forEach((color) => {
    //   console.log(color);
    // });
    const palette = this.AlyleUI.palette;
    const iterate = (obj, fn: (item, key: string) => void, keyObject?: string) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          let key$ = keyObject || key;
          if (key !== 'default' && keyObject) {
            // key$ = `${keyObject}__${key}`;
            key$ = `${keyObject}__${key}`;
          }
          // console.log(key, element);
          if (typeof obj[key] === 'object') {
            iterate(obj[key], fn, key$);
          } else {
            fn(obj[key], key$);
          }
        }
      }
    };
    let myStyle = '';
    iterate(palette, (item, key) => {
      /** Color */
      myStyle += `.${this.Id}-${key}-color{color:${item}}`;
      /** Bg */
      myStyle += `.${this.Id}-${key}-bg{background:${item}}`;
    });
    const content = this.renderer.createText(myStyle);
    this.renderer.appendChild(newStyle, content);
    this.renderer.setAttribute(newStyle, 'aui', this.Id);
    this.renderer.insertBefore(this.document.head, newStyle, this.auiRef);
    if (this.containerStyle) {
      this.renderer.removeChild(this.document.head, this.containerStyle);
    }
    this.containerStyle = newStyle;
  }

  constructor(
    @Optional() config: AlyleServiceConfig,
    @Inject(DOCUMENT) private document,
    private sanitizer: DomSanitizer,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.setAuiRef();
    this.Id = `ĸ-${themeId.toString(36)}`;
    config = mergeDeep(defaultTheme as AlyleServiceConfig, config);
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
    getAllColors = mergeDeep(getAllColors, scheme);

    // this.createShades(primary.color[shade]);
    /* tslint:disable */
    this.AlyleUI = {
      currentTheme: config,
      palette: parsePalette(getAllColors),
    };
    console.log(this.AlyleUI);
    /* tslint:enable */
    this.primary = new BehaviorSubject<any>(primary);
    this.accent = new BehaviorSubject<any>(accent);
    this.other = new BehaviorSubject<any>(other);
    this.scheme = new BehaviorSubject<any>(scheme);
    this.typography = new BehaviorSubject<any>(typography);
    this.shade = new BehaviorSubject<any>(shade);
    this.palette = new BehaviorSubject<any>(getAllColors);
    this.updateStyle();
    themeId++;
  }

  setAuiRef() {
    if (!this.auiRef) {
      const ref = this.renderer.createElement('meta');
      this.renderer.setAttribute(ref, 'aui-ref', '');
      this.renderer.appendChild(this.document.head, ref);
      this.auiRef = ref;
    }
  }

  // private addShades(primary, accent, other) {
  //   this.createShades(primary.color[shade]);
  // }

  private _gradStop(colors: string[], stops) {
    return gradStop({
      stops: stops,
      inputFormat: 'hex',
      colorArray: colors
    });
  }
  private _getGrad(color: string) {
    const toBlack = this._gradStop(['#ffffff', color], 11);
    const toWhite = this._gradStop([color, '#000000'], 33);
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
      }
    });
    return shades;
  }

  setTheme(config: AlyleServiceConfig) {
    const currentTheme = this.AlyleUI.currentTheme;
    config = mergeDeep(currentTheme as AlyleServiceConfig, config);
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
      getAllColors = mergeDeep(getAllColors, scheme);

      // this.createShades(primary.color[shade]);

      /* tslint:disable */
      this.AlyleUI = {
        currentTheme: config,
        palette: parsePalette(getAllColors)
      }
      /* tslint:enable */
      this.primary.next(primary);
      this.accent.next(accent);
      this.other.next(other);
      this.scheme.next(scheme);
      this.typography.next(typography);
      this.shade.next(shade);
      this.palette.next(getAllColors);
      this.updateStyle();
      this.updateOthersStyles();
    }
  }

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
    // const shade = this.AlyleUI.currentTheme.shade;
    let current = theme;
    const values = value.split(/:/g);
    values.forEach((item, index) => {
      if (current[item]) {
        current = current[item];
      } else if (index > 0) {
        console.warn(`\n\n>>>\`${value}\` undefined in LyTheme\n`);
      }
    });
    if (!current['default']) {
      current = value;
    } else {
      current = current['default'];
    }
    return current;
  }

  private getColorv2(colorName: string, colors: any, shade?: string): string {
    const ar = colors ? colors : this.AlyleUI.palette;
    if (ar[colorName]) {
      if (typeof ar[colorName].color === 'string' || typeof ar[colorName] === 'string') {
        return ar[colorName].color || ar[colorName];
      } else {
        return ar[colorName].color[shade];
      }
    } else {
      return colorName;
    }
  }

  paletteOf(colorName: string): ThemeColor {
    return this.findColor(colorName);
  }

  createStyle(_id: string, fn: (...arg) => string, ...arg) {
    let styleData: StyleData;
    const key = createKeyOf(`${this.Id}${_id}`);
    // console.log('existStyle', this.existStyle(key));
    if (!this._styleMap.has(key)) {
      this._styleMap.set(key, null);
      classId++;
      const id = `ly_${classId.toString(36)}`;
      const styleContainer = this.renderer.createElement('style');
      const styleContent = this.renderer.createText(`.${id}{${fn(...arg)}}`);
      this.renderer.setAttribute(styleContainer, `aui-id`, key);
      this.renderer.appendChild(styleContainer, styleContent);
      this.renderer.insertBefore(this.document.head, styleContainer, this.auiRef);
      styleData = {
        id,
        key,
        styleContainer,
        styleContent,
        value: {
          fn: fn,
          arg: arg
        }
      };
      this._styleMap.set(key, styleData);
      return styleData;
    } else {
      return this._styleMap.get(key);
    }
  }
  /** #style */
  createClassContent(value: string, id: string) {
    return `.${id}{${value}}`;
  }

  /** #style */
  createStyleContent(styleData: StyleData) {
    return this.renderer.createText(`.${styleData.id}{${styleData.value.fn(...styleData.value.arg)}}`);
  }

  /** Update style of StyleData */
  private updateStyleValue(style: StyleData, styleText: string) {
    const styleContent = styleText;
    this.renderer.removeChild(style.styleContainer, style.styleContent);
    this.renderer.appendChild(style.styleContainer, styleContent);
    this._styleMap.set(style.key, Object.assign({}, style, {
      styleContainer: style.styleContainer,
      styleContent
    }));
  }
  /** #style: Update all styles */
  private updateOthersStyles() {
    this._styleMap.forEach((styleData) => {
      const newStyleValue = this.createStyleContent(styleData);
      this.updateStyleValue(styleData, newStyleValue);
    });
  }

}

export interface StyleData {
  /** Class Id */
  id: string;
  key: string;
  styleContainer: any;
  styleContent: any;
  value: {
    fn: (...arg) => string,
    arg: any[];
  };
}

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export function parsePalette(palette: { [key: string]: any }) {
  const iterate = (obj, keyObject?: string) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const key$ = keyObject ? `${keyObject}__${key}` : key;
        if (
          obj[key] !== null &&
          typeof obj[key] === 'string' &&
          key !== 'default'
        ) {
          obj[key] = { default: obj[key] };
        }
        if (typeof obj[key] === 'object') {
          iterate(obj[key], key$);
        }
      }
    }
    return obj;
  };
  return iterate(Object.assign({}, palette));
}

function createKeyOf(str: string) {
  return str.split('').map((char) => {
      return char.charCodeAt(0).toString(36);
  }).join('·');
}
