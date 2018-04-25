import { Injectable, Optional, Renderer2, RendererFactory2, Inject, ElementRef, ApplicationRef, ViewContainerRef, Injector, SkipSelf, Host, Self } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defaultTheme } from './default-theme';
import { ThemeVariables, PaletteVariables, IS_CORE_THEME, THEME_VARIABLES, PALETTE } from './alyle-config-service';
import { Subject } from 'rxjs';
import { gradStop } from './gradstop';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Platform } from './platform';
import { LyRootService } from './root.service';
import { isDevMode } from '@angular/core';

let classId: number;
if (Platform.isBrowser) {
  classId = 0;
} else {
  classId = -9e9;
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
  private themeContainer;
  themeName: string;
  _styleMap = new Map<string, StyleData>();
  AlyleUI: {currentTheme: ThemeVariables, palette: any};
  primary: Subject<any>;
  accent: Subject<any>;
  other: Subject<any>;
  scheme: Subject<any>;
  typography: Subject<any>;
  shade: Subject<string>;

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
    @Inject(THEME_VARIABLES) config: ThemeVariables,
    @Inject(THEME_VARIABLES) @Host() @Self() @Optional() parent: ThemeVariables,
    @Inject(IS_CORE_THEME) private isRoot: boolean,
    @Inject(PALETTE) private palette: ThemeVariables,
    @Inject(DOCUMENT) private document,
    private rootService: LyRootService
  ) {
    const newConfig = mergeDeep(mergeDeep(defaultTheme, parent), config);

    const _palette = {...newConfig};
    const theme = this.rootService.registerTheme(_palette);

    /** check if exist scheme */
    if (!theme.palette.colorSchemes[theme.palette.scheme]) {
      throw new Error(`scheme ${theme.palette.scheme} not exist in ${theme.palette.name}`);
    }
    this._styleMap = theme.map;
    // delete palette['colorSchemes'];
    Object.assign(palette, theme.palette, { scheme: config.scheme }, ...theme.palette.colorSchemes[newConfig.scheme]);
    this.themeName = newConfig.name;
    this.Id = `${this.themeName}`;
    console.log('themes id :', this.Id, palette);
    // const primary    = this._setColorPalette(config.primary, _palette);
    // const accent     = this._setColorPalette(config.accent, _palette);
    // const other      = this._setColorPalette(config.other, _palette);
    // const scheme     = config.schemes[config.colorScheme];
    // const variables = config.variables;
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

    const getAllColors = {
      ...newConfig.colorSchemes[newConfig.scheme],
      ...newConfig
      // colorText: {color: scheme.text.default},
      // bgText: {color: scheme.background.default}
    };
    // getAllColors = mergeDeep(getAllColors, scheme);

    // this.createShades(primary.color[shade]);
    /* tslint:disable */
    this.AlyleUI = {
      currentTheme: newConfig,
      palette: parsePalette(getAllColors),
    };
    /* tslint:enable */
    this.primary = new BehaviorSubject<any>(null);
    this.accent = new BehaviorSubject<any>(null);
    this.other = new BehaviorSubject<any>(null);
    this.scheme = new BehaviorSubject<any>(null);
    // this.palette = new BehaviorSubject<any>(getAllColors);
    // this.palette.subscribe(() => {
    //   if (isDevMode) {
    //     console.warn('deprecated: palette Observable');
    //   }
    // });
    this.setCoreStyle();
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

  setTheme(config: ThemeVariables) {
    // const currentTheme = this.AlyleUI.currentTheme;
    // config = mergeDeep(currentTheme as ThemeVariables, config);
    // if (config) {
    //   const primary    = this._setColorPalette(config.primary, this._palette);
    //   const accent     = this._setColorPalette(config.accent, this._palette);
    //   const other      = this._setColorPalette(config.other, this._palette);
    //   const scheme     = config.schemes[config.colorScheme];
    //   const variables  = config.variables;
    //   let getAllColors = {
    //     primary,
    //     accent,
    //     other,
    //     ...variables
    //   };
    //   getAllColors = mergeDeep(getAllColors, scheme);

    //   // this.createShades(primary.color[shade]);

    //   /* tslint:disable */
    //   this.AlyleUI = {
    //     currentTheme: config,
    //     palette: parsePalette(getAllColors)
    //   }
    //   /* tslint:enable */
    //   this.primary.next(primary);
    //   this.accent.next(accent);
    //   this.other.next(other);
    //   this.scheme.next(scheme);
    //   this.palette.next(getAllColors);
    //   this.updateOthersStyles();
    // }
  }

  /**
   * get color of `string` in palette
   * @param value
   */
  colorOf(value: string): string {
    return get(this.palette, value);
  }
  private getColorv2(colorName: string, colors: any, shade?: string): string {
    const ar = colors ? colors : this.palette;
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

  createStyle(_id: string, fn: (...arg) => string, ...arg) {
    const newKey = `${this.Id}_${createKeyOf(_id)}`;
    const styleData: StyleData = {key: newKey, value: {
      fn: fn,
      arg: arg
    }} as any;
    if (this._styleMap.has(newKey)) {
      return this._styleMap.get(newKey);
    } else if (Platform.isBrowser && (styleData.styleContainer = window.document.body.querySelector(`ly-core-theme style[data-key="${newKey}"]`))) {
      this._styleMap.set(newKey, null);
      styleData.styleContent = styleData.styleContainer.innerHTML;
      styleData.id = styleData.styleContainer.dataset.id;
      // this.rootService.renderer.removeChild(this.document.head, styleData.styleContainer);
      this._styleMap.set(newKey, styleData);
    } else {
      classId++;
      styleData.id = `ly_${classId.toString(36)}`;
      styleData.styleContainer = this.rootService.renderer.createElement('style');
      styleData.styleContent = this.rootService.renderer.createText(`.${styleData.id}{${fn(...arg)}}`);
      this.rootService.renderer.appendChild(styleData.styleContainer, styleData.styleContent);
      this.rootService.renderer.appendChild(this.rootService.rootContainer, styleData.styleContainer);
      this._styleMap.set(newKey, styleData);
      if (!Platform.isBrowser) {
        this.rootService.renderer.setAttribute(styleData.styleContainer, `data-key`, `${newKey}`);
        this.rootService.renderer.setAttribute(styleData.styleContainer, `data-id`, `${styleData.id}`);
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
    return this.rootService.renderer.createText(`.${styleData.id}{${styleData.value.fn(...styleData.value.arg)}}`);
  }

  /** Update style of StyleData */
  private updateStyleValue(style: StyleData, styleText: string) {
    const styleContent = styleText;
    this.rootService.renderer.removeChild(style.styleContainer, style.styleContent);
    this.rootService.renderer.appendChild(style.styleContainer, styleContent);
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
  updateClass(elementRef: ElementRef, renderer: Renderer2, newStyleData: StyleData, oldStyleData?: StyleData) {
    if (oldStyleData) {
      renderer.removeClass(elementRef.nativeElement, oldStyleData.id);
    }
    renderer.addClass(elementRef.nativeElement, newStyleData.id);
  }

  private setCoreStyle() {
    if (this.isRoot) {
      const newStyle = this.createStyle('body', () => {
        return `background:${this.palette.background.default};` +
        `color:${this.palette.text.default};` +
        `margin:0;`;
      });
      this.rootService.renderer.addClass(this.document.body, newStyle.id);
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

function get(obj: Object, path: any): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    obj = obj[_path[i]] || path;
  }
  return typeof obj === 'string' ? obj as string : obj['default'] as string;
}
