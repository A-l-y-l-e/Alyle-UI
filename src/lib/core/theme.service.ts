import { Injectable, Optional, Renderer2, RendererFactory2, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defaultTheme } from './default-theme';
import { AlyleServiceConfig } from './alyle-config-service';
import { Subject } from 'rxjs/Subject';
import { gradStop } from './gradstop';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DomSanitizer, SafeStyle, TransferState, makeStateKey } from '@angular/platform-browser';
import { Platform } from './platform';

const CLASS_ID_KEY = makeStateKey('class_id');

let classId: number;
if (Platform.isBrowser) {
  classId = 0;
} else {
  classId = -9e9;
}
let isInitialized;
let themeId = 0;

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
  rootElement: HTMLElement;
  classId = this.state.get(CLASS_ID_KEY, null as number);
  renderer: Renderer2;
  Id: string;
  containerStyle;
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

  constructor(
    @Optional() config: AlyleServiceConfig,
    @Inject(DOCUMENT) private document,
    private sanitizer: DomSanitizer,
    private rendererFactory: RendererFactory2,
    private state: TransferState
  ) {
    console.log(this.Id, '_config', config);
    if (!isInitialized && this.classId) {
      classId = this.classId;
      isInitialized = true;
    }
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.Id = `ĸ${themeId.toString(36)}`;
    config = mergeDeep(defaultTheme as AlyleServiceConfig, config);
    const primary    = this._setColorPalette(config.primary, config.palette);
    const accent     = this._setColorPalette(config.accent, config.palette);
    const other      = this._setColorPalette(config.other, config.palette);
    const shade      = config.shade;
    const scheme     = config.schemes[config.colorScheme];
    const typography = config.typography;
    const variables = config.variables;
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
      primary,
      accent,
      other,
      ...variables
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
    /* tslint:enable */
    this.primary = new BehaviorSubject<any>(primary);
    this.accent = new BehaviorSubject<any>(accent);
    this.other = new BehaviorSubject<any>(other);
    this.scheme = new BehaviorSubject<any>(scheme);
    this.typography = new BehaviorSubject<any>(typography);
    this.shade = new BehaviorSubject<any>(shade);
    this.palette = new BehaviorSubject<any>(getAllColors);
    themeId++;
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
      const variables  = config.variables;
      let getAllColors = {
        primary,
        accent,
        other,
        ...variables
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
    const newKey = createKeyOf(`${this.Id}${_id}`);
    const styleData: StyleData = {key: newKey, value: {
      fn: fn,
      arg: arg
    }} as any;
    console.log('key', `${this.Id}${_id}`, newKey);
    if (this._styleMap.has(newKey)) {
      return this._styleMap.get(newKey);
    } else if (Platform.isBrowser && (styleData.styleContainer = window.document.head.querySelector(`style[data-key="${newKey}"]`))) {
      this._styleMap.set(newKey, null);
      styleData.styleContent = styleData.styleContainer.innerHTML;
      styleData.id = styleData.styleContainer.dataset.id;
      // this.renderer.removeChild(this.document.head, styleData.styleContainer);
      this._styleMap.set(newKey, styleData);
      console.warn('key found', newKey);
    } else {
      this._styleMap.set(newKey, null);
      classId++;
      styleData.id = `ly_${classId.toString(36)}`;
      styleData.styleContainer = this.renderer.createElement('style');
      styleData.styleContent = this.renderer.createText(`.${styleData.id}{${fn(...arg)}}`);
      this.renderer.appendChild(styleData.styleContainer, styleData.styleContent);
      this.renderer.appendChild(this.document.head, styleData.styleContainer);
      this._styleMap.set(newKey, styleData);
      if (!Platform.isBrowser) {
        this.renderer.setAttribute(styleData.styleContainer, `data-key`, `${newKey}`);
        this.renderer.setAttribute(styleData.styleContainer, `data-id`, `${styleData.id}`);
      }
    }
    return styleData;
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

  /** Replace old class by newClass */
  updateClass(elementRef: ElementRef, renderer: Renderer2, newClass: string, oldClass?: string) {
    if (oldClass) {
      renderer.removeClass(elementRef.nativeElement, oldClass);
    }
    if (newClass) {
      renderer.addClass(elementRef.nativeElement, newClass);
    }
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
  }).join('');
}
