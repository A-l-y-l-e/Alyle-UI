import { Injectable, Optional, Renderer2, RendererFactory2, Inject, ElementRef, ApplicationRef, ViewContainerRef, Injector, SkipSelf, Host, Self, isDevMode } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { defaultTheme } from './default-theme';
import { ThemeVariables, PaletteVariables, IS_CORE_THEME, THEME_VARIABLES } from './alyle-config-service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Platform } from './platform';
import { LyRootService } from './root.service';
import { containsTree } from '@angular/router/src/url_tree';

let classId = 0;

/** Prefix for className */
let prefix: string;
if (Platform.isBrowser) {
  prefix = 'ly_';
} else {
  prefix = 'l';
}

@Injectable()
export class LyTheme {
  renderer: Renderer2;
  Id: string;
  private themeContainer;
  themeName: string;
  _styleMap: Map<string, StyleData>;
  AlyleUI: {currentTheme: ThemeVariables, palette: any};
  palette: ThemeVariables;
  private styleMap = new Map<string, DataStyle>();

  /** get class name of color */
  getClassKey(color: string, of: 'color' | 'bg') {
    return `${this.Id}-${color.replace(':', '__')}-${of}`;
  }

  constructor(
    @Inject(THEME_VARIABLES) config: ThemeVariables,
    @Inject(IS_CORE_THEME) private isRoot: boolean,
    @Inject(DOCUMENT) private document,
    private rootService: LyRootService
  ) {
    const newConfig = mergeDeep(defaultTheme, config);

    const _palette = newConfig;
    const theme = this.rootService.registerTheme(_palette);

    /** check if exist scheme */
    if (!theme.palette.colorSchemes[theme.palette.scheme]) {
      throw new Error(`scheme ${theme.palette.scheme} not exist in ${theme.palette.name}`);
    }
    this._styleMap = theme.map;
    // Object.assign(this.palette, theme.palette, { scheme: config.scheme }, ...theme.palette.colorSchemes[newConfig.scheme]);
    this.palette = mergeDeep(theme.palette, { scheme: config.scheme }, ...theme.palette.colorSchemes[newConfig.scheme]);
    this.themeName = newConfig.name;
    this.Id = `${this.themeName}`;
  }

  setScheme(scheme: string) {
    const newPalette = this.rootService.getTheme(this.palette.name);
    this.palette = mergeDeep(newPalette, ...newPalette.colorSchemes[scheme], { scheme });
    this.updateOthersStyles();
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

  /**
   * Create new style if not exist, for Theme
   * @param key unique id
   * @param fn style
   */
  setStyle(key: string, fn: StyleContent): string {
    const newKey = createKeyOf(key + this.Id + this.palette.scheme);
    const mapStyles = this._styleMap;
    return this._createStyle(key, newKey, fn, mapStyles, this.Id);
  }

  /**
   * Create new style if not exist, for Root
   * Important: this not update when change theme
   * @param key unique id
   * @param fn style
   */
  setRootStyle(key: string, fn: StyleContent): string {
    const newKey = createKeyOf(key);
    const mapStyles = this.rootService.themeRootMap;
    return this._createStyle(key, newKey, fn, mapStyles, 'root');
  }

  // setExtraStyle(key: string, extra: string, fn: StyleContent) {
  //   const mapStyles = this._styleMap;
  //   const id = mapStyles.get(key).id;
  //   if (id) {

  //   }
  // }
  // setExtraStyleRoot(key: string, extra: string, fn: StyleContent) {
  //   const mapStyles = this.rootService.themeRootMap;
  //   const id = mapStyles.get(key).id;
  //   if (id) {

  //   }
  // }

  private _createStyle(key: string, newKey: string, fn: StyleContent, mapStyles: Map<string, StyleData>, _for: string) {
    const styleData: StyleData = { key: newKey, fn } as any;
    if (mapStyles.has(newKey)) {
      return mapStyles.get(newKey).id;
    } else if (Platform.isBrowser && (styleData.styleContainer = this.document.body.querySelector(`ly-core-theme style[data-key="${newKey}"]`))) {
      styleData.styleContent = styleData.styleContainer.innerText;
      styleData.id = styleData.styleContainer.dataset.id;
    } else {
      classId++;
      styleData.id = `${prefix}${classId.toString(36)}`;
      styleData.styleContainer = this.rootService.renderer.createElement('style');
      const content = this.createStyleContent(styleData);
      // if (isDevMode()) {
      //   content = `/** key: ${key}, for: ${_for} */\n${content}`;
      // }
      styleData.styleContent = content;
      this.rootService.renderer.appendChild(styleData.styleContainer, styleData.styleContent);
      this.rootService.renderer.appendChild(this.rootService.rootContainer, styleData.styleContainer);
      if (!Platform.isBrowser) {
        this.rootService.renderer.setAttribute(styleData.styleContainer, `data-key`, `${newKey}`);
        this.rootService.renderer.setAttribute(styleData.styleContainer, `data-id`, `${styleData.id}`);
      }
    }
    mapStyles.set(newKey, styleData);
    return styleData.id;
  }

  /** #style */
  private createStyleContent(styleData: StyleData) {
    return this.rootService.renderer.createText(`.${styleData.id}{${styleData.fn()}}`);
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
  /** Replace old class by newClass */
  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    if (oldClassname) {
      renderer.removeClass(element, oldClassname);
    }
    renderer.addClass(element, newClassname);
  }

}

export type StyleContent = () => string;

export interface StyleData {
  /** Class Id */
  id: string;
  key: string;
  styleContainer: any;
  styleContent: any;
  fn: () => string;
}
export interface DataStyle {
  id: string;
  styleElement: HTMLStyleElement;
  style: MultipleStyles;
}

// export function isObject(item) {
//   return (item && typeof item === 'object' && !Array.isArray(item));
// }

export interface MultipleStyles {
  [key: string]: StyleContent;
}

export function mergeDeep(...objects) {
  // const output = Object.assign({}, target);
  // if (isObject(target) && isObject(source)) {
  //   Object.keys(source).forEach(key => {
  //     if (isObject(source[key])) {
  //       if (!(key in target)) {
  //         Object.assign(output, { [key]: source[key] });
  //       } else {
  //         output[key] = mergeDeep(target[key], source[key]);
  //       }
  //     } else {
  //       Object.assign(output, { [key]: source[key] });
  //     }
  //   });
  // }
  // return output;
  const isObject = obj => obj && typeof obj === 'object';
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
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
  // return str.split('').map((char) => {
  //     return char.charCodeAt(0).toString(36);
  // }).join('');
  let hash = 0;
  const len = str.length;
  for (let i = 0; i < len; i++) {
    // tslint:disable-next-line:no-bitwise
    hash  = ((hash << 5) - hash) + str.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash |= 0; // to 32bit integer
  }
  return hash.toString(36);
}

function get(obj: Object, path: any): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    obj = obj[_path[i]] || path;
  }
  return typeof obj === 'string' ? obj as string : obj['default'] as string;
}
