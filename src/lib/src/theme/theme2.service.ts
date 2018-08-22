import { Injectable, Renderer2, Inject, Optional, isDevMode, SkipSelf } from '@angular/core';
import { ThemeConfig, LY_THEME_NAME } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle, Style } from '../theme.service';
import { InvertMediaQuery } from '../media/invert-media-query';
import { Platform } from '../platform';
import { DOCUMENT } from '@angular/common';

const REF_REG_EXP = /\{([\w-]+)\}/g;

interface StylesElementMap {
  el: any;
}

enum TypeStyle {
  Multiple,
  OnlyOne
}
const STYLE_MAP4: StyleMap4 = {};
export interface StyleMap4 {
  [id: string]: {
    styles: StylesFn2<any> | Styles2
    type: TypeStyle
    priority: number
    css: {
      [themeName: string]: string
    } | string
    requireUpdate?: boolean
  };
}

// interface StyleMap03 {
//   [id: string]: { // example: lyTabs
//     styles: StylesFn2<any> | Styles2,
//     media?: string,
//     typeStyle?: TypeStyle,
//     themes: { // example: minima-dark
//       /** Css */
//       default?: string,
//       [themeName: string]: string
//     }
//   };
// }

// const STYLE_MAP_03: StyleMap03 = {} as any;

const STYLE_MAP: {
  [key: string]: Map<string, StylesElementMap>
} = {};
const CLASSES_MAP: {
  [idOrThemeName: string]: {
    [className: string]: string
  } | string
} = {};
const STYLE_KEYS_MAP = {};
let nextId = 0;
// function fn() {
//   return CLASSES_MAP;
// }
// console.log({fn});

@Injectable({
  providedIn: 'root'
})
export class StylesInDocument {
  styles: {
    [themeName: string]: {
      [key: string]: HTMLStyleElement
    }
  } = {};
  styleContainers = new Map<number, HTMLElement>();
}

@Injectable()
export class LyTheme2 {
  config: ThemeConfig;
  _styleMap: Map<string, DataStyle>;
  prefix = 'k';
  initialTheme: string;
  elements: {
    [key: string]: HTMLStyleElement
  };
  private _styleMap2: Map<string, StylesElementMap>;

  get classes() {
    return CLASSES_MAP;
  }

  constructor(
    private stylesInDocument: StylesInDocument,
    public core: CoreTheme,
    @Inject(LY_THEME_NAME) themeName,
    @Inject(DOCUMENT) private _document: any
  ) {
    if (themeName) {
      this.setUpTheme(themeName);
    }
  }
  setUpTheme(themeName: string) {
    if (!this.config) {
      this._styleMap2 = themeName in STYLE_MAP
      ? STYLE_MAP[themeName]
      : STYLE_MAP[themeName] = new Map();
      this.config = this.core.get(themeName);
      this._styleMap = new Map<string, DataStyle>();
      this.elements = themeName in this.stylesInDocument.styles
      ? this.stylesInDocument.styles[themeName]
      : this.stylesInDocument.styles[themeName] = {};
      this._createInstanceForTheme(themeName);
      if (!this.initialTheme) {
        this.initialTheme = this.config.name;
      }
    }
  }
  setUpStyle<T>(
    key: string,
    styles: Style<T>,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    const name = this.config.name;
    return this.core._ĸreateStyle<T>(this.config, key, styles, this._styleMap, name, this.core.primaryStyleContainer, media, invertMediaQuery);
  }
  setUpStyleSecondary<T>(
    key: string,
    styles: Style<T>,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    const name = this.config.name;
    return this.core._ĸreateStyle<T>(this.config, key, styles, this._styleMap, name, this.core.secondaryStyleContainer, media, invertMediaQuery);
  }

  /**
   * Add a new dynamic style, use only within @Input()
   * @param id Unique id
   * @param style Styles
   * @param el Element
   * @param instance The instance of this, this replaces the existing style with a new one when it changes
   */
  addStyle<T>(id: string, style: Style<T>, el?: any, instance?: string, priority?: number) {
    const newClass = this.addCss(id, style as any, priority);
    if (instance) {
      el.classList.remove(instance);
    }
    el.classList.add(newClass);
    return newClass;
  }

  /** @deprecated */
  colorOf(value: string): string {
    return get(this.config, value);
  }
  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    this.core.updateClassName(element, renderer, newClassname, oldClassname);
  }
  updateClass(element: any, renderer: Renderer2, newClass: string, oldClass?: string) {
    this.updateClassName(element, renderer, newClass, oldClass);
    return newClass;
  }
  setTheme(nam: string) {
    if (!Platform.isBrowser) {
      throw new Error(`\`theme.setTheme('theme-name')\` is only available in browser platform`);
    }
    this.config = this.core.get(nam);
    // this._styleMap2.forEach(dataStyle => {
    //   dataStyle.el.innerText = this._createStyleC ontent2(dataStyle.styles, dataStyle.id);
    // });
    // for (const key in STYLE_MAP_03) {
    //   if (STYLE_MAP_03.hasOwnProperty(key)) {
    //     const { styles, typeStyle, media } = STYLE_MAP_03[key];
    //     // this._createStyleContent2(styles, key, typeStyle, this.core.renderer, true, media);
    //   }
    // }
    this._styleMap.forEach((dataStyle) => {
      dataStyle.styleElement.innerText = this.core._createStyleContent(this.config, dataStyle.style, dataStyle.id);
    });

    const { styleContainers, styles } = this.stylesInDocument;
    const currentStyles = this.elements;
    for (const key in currentStyles) {
      if (currentStyles.hasOwnProperty(key)) {
        const styleData = STYLE_MAP4[key];
        if (styleData.requireUpdate) {
          this._createStyleContent2(styleData.styles, key, styleData.priority, styleData.type, true);
        }
      }
    }
  }

  /**
   * add style, similar to setUpStyle but this only accept string
   * @param id id of style
   * @param css style in string
   */
  private addCss(id: string, css: ((t) => string) | string, priority: number, media?: string): string {
    const newId = `~>${id}`;
    return this._createStyleContent2(css as any, newId, priority, TypeStyle.OnlyOne, false, media) as string;
  }

  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param id unique id for style group
   */
  addStyleSheet<T>(styles: T & (StylesFn2<T> | Styles2), id?: string, priority?: number): IClasses<T> {
    const newId = id || 'global';
    // const styleElement = this.core.renderer.createElement('style');
    return this._createStyleContent2(styles, newId, priority, TypeStyle.Multiple);
  }

  _createStyleContent2<T>(
    styles: StylesFn2<T> | Styles2,
    id: string,
    priority: number,
    type: TypeStyle,
    forChangeTheme?: boolean,
    media?: string
  ) {
    const styleMap = (id in STYLE_MAP4
    ? STYLE_MAP4[id]
    : STYLE_MAP4[id] = {
      priority,
      styles,
      type,
      css: {}
    });
    // const styles2 = this.config.name in this.stylesInDocument.styles
    // ? this.stylesInDocument.styles[this.config.name]
    // : this.stylesInDocument.styles[this.config.name] = {};
    // console.log(
    //   'ccc', typeof styleMap.css !== 'string' && !(id in styleMap.css),
    //   typeof CLASSES_MAP[id] === 'string' || typeof CLASSES_MAP[id] === 'object' || CLASSES_MAP[this.config.name][id]
    // );
    const themeName = this.initialTheme;
    const isCreated = (id in CLASSES_MAP) || CLASSES_MAP[themeName][id];
    if (!isCreated || forChangeTheme) {
      /** create new style for new theme */
      let css;
      if (typeof styles === 'function') {
        // CLASSES_MAP[id] = {};
        // const themeMap = this.config.name in styleMap.classes
        // ? styleMap.classes[this.config.name]
        // : styleMap.classes[this.config.name] = {};
        // const className = id in (themeMap as Object)
        // ? themeMap[id]
        // : themeMap[id] = this._nextId();
        css = groupStyleToString(styles(this.config), themeName, isCreated, id, type, media);
        if (!forChangeTheme) {
          styleMap.css[themeName] = css;
          styleMap.requireUpdate = true;

        }
      } else {
        /** create a new id for style that does not <-<require>-> changes */
        CLASSES_MAP[id] = true as any;
        css = groupStyleToString(styles, themeName, isCreated, id, type, media);
        styleMap.css = css;
      }

      // this.core.renderer.appendChild(this.core.primaryStyleContainer, styleElement);
      // if (!this._styleMap2.has(id)) {
      //   const styleElement = this.core.renderer.createElement('style');
      //   const styleText = this.core.renderer.createText(css);
      //   this.core.renderer.appendChild(styleElement, styleText);
      //   this._styleMap2.set(id, {
      //     el: styleElement
      //   });
      // }
      const el = this.elements[id]
      ? this.elements[id]
      : this.elements[id] = this._createElementStyle(
        css
      );
      if (forChangeTheme) {
        el.innerText = css;
      } else {
        this.core.renderer.appendChild(this._createStyleContainer(priority), el);
      }
    }

    // if (!(id in this.elements)) {
      // const htmlStyle = this._createElementStyle(
      //   typeof styleMap.css === 'string'
      //   ? styleMap.css
      //   : styleMap.css[this.config.name]
      // );
      // this.elements[id] = htmlStyle;
      // this.core.renderer.appendChild(this.core.primaryStyleContainer, htmlStyle);
    // }

    const classes = typeof CLASSES_MAP[id] === 'string'
    ? CLASSES_MAP[id]
    : typeof CLASSES_MAP[id] === 'object'
    ? CLASSES_MAP[id]
    : CLASSES_MAP[themeName][id];
    return classes;

    // const style = this._styleMap2.get(id);
    // if (!this.stylesInDocument.styles.has(id)) {
    //   this.stylesInDocument.styles.add(id);
    //   this.core.renderer.appendChild(this.core.primaryStyleContainer, style.el);
    // }
    // if (forChangeTheme && styleMap.themes[this.config.name]) {
    //   style.el.innerText = styleMap.themes[this.config.name];
    // }
  }

  private _createStyleContainer(priority = 0) {
    const { styleContainers } = this.stylesInDocument;
    if (!styleContainers.has(priority)) {
      const el = this.core.renderer.createElement(`ly-s-c`);
      if (isDevMode()) {
        this.core.renderer.setAttribute(el, 'priority', `${priority}`);
      }
      styleContainers.set(priority, el);
      if (styleContainers.size === 0) {
        this.core.renderer.insertBefore(this._document.body, el, this._document.body.firstChild);
        return el;
      }
    } else {
      return styleContainers.get(priority);
    }
    const refChild = this.findNode(priority);
    this.core.renderer.insertBefore(this._document.body, styleContainers.get(priority), refChild);
    return styleContainers.get(priority);
  }

  private findNode(index: number) {
    const { styleContainers } = this.stylesInDocument;
    const keys = (Array.from(styleContainers.keys())).sort();
    const key = keys.find(_ => index < _);
    return (key && styleContainers.get(key)) || this.core.firstElement;
  }

  private _createElementStyle(css: string) {
    const styleElement = this.core.renderer.createElement('style');
    const styleText = this.core.renderer.createText(css);
    this.core.renderer.appendChild(styleElement, styleText);
    return styleElement;
  }

  private _createInstanceForTheme(themeName: string) {
    if (!(themeName in CLASSES_MAP)) {
      CLASSES_MAP[themeName] = {};
    }
  }

}

export interface StyleContainer {
  [key: string]: StyleContainer | string | number;
}

export interface Styles2 {
  [key: string]: StyleContainer;
}
export type StylesFn2<T> = (T) => Styles2;

function groupStyleToString(styles: Styles2, themeName: string, _classes_: string | {}, id: string, typeStyle: TypeStyle, media?: string) {
  // let newKey = '';
  // const string
  // const themeMap = classes[themeName] ? classes[themeName] : classes[themeName] = {};
  if (typeStyle === TypeStyle.OnlyOne) {
    /** use current class or set new */
    const className = CLASSES_MAP[id]
    ? CLASSES_MAP[id] = _classes_ || createNextId()
    : CLASSES_MAP[themeName][id] = _classes_ || createNextId();
    if (typeof styles === 'string') {
      const css = `.${className}{${styles}}`;
      // STYLE_MAP4[id].rules = styles;
      return media ? toMedia(css, media) : css;
    } else {
      const rules = styleToString(id, styles, className as any);
      return rules;
    }
  }
  let content = '';
  // const classesMap = id in themeMap
  // ? themeMap[id]
  // : themeMap[id] = {};
  const classes = CLASSES_MAP[id]
  ? CLASSES_MAP[id] = _classes_ || {}
  : CLASSES_MAP[themeName][id] = _classes_ || {};
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const value = styles[key];
      if (typeof value === 'object') {
        const className = classes[key] || (classes[key] = isDevMode() ? toClassNameValid(`${id}---${key}-${createNextId()}`) : createNextId());
        const style = styleToString(key, value as Styles2, className);
        content += style;
      } else {
        console.log('value is string', value);
      }
    }
  }
  return replaceRefs(content, classes);
}

function replaceRefs(str: string, data: Object) {
  return str.replace(REF_REG_EXP, (match, token) => {
    return `.${data[token]}`;
  }
  );
}

/**
 * {color:'red'} to .className{color: red}
 */
function styleToString(key: string, ob: Object, currentKey: string, parentKey?: string) {
  let content = '';
  let subContent = '';
  let keyAndValue = '';
  let newKey;
  if (parentKey && currentKey.indexOf('&') !== -1) {
    newKey = currentKey.replace('&', parentKey);
  } else if (key === '@global') {
    newKey = key;
  } else {
    newKey = currentKey;
  }
  for (const styleKey in ob) {
    if (ob.hasOwnProperty(styleKey)) {
      const element = ob[styleKey];
      if (typeof element === 'object') {
        subContent += styleToString(key, element as Styles2, styleKey, newKey);
      } else {
        const newStyleKey = toHyphenCaseCache(styleKey);
        keyAndValue += `${newStyleKey}:${element};`;
      }
    }
  }
  // if (!parentKey) {
  //   console.log({currentKey, key, subContent});
  // }
  if (keyAndValue) {
    if (newKey.indexOf('@media') === 0) {
      content += `${newKey}`;
      keyAndValue = `.${parentKey}{${keyAndValue}}`;
    } else if (parentKey && parentKey === '@global') {
      content += `${currentKey}`;
    } else {
      content += `.${newKey}`;
    }
    content += `{${keyAndValue}}`;
  }
  return content + subContent;
}

/** @deprecated */
function get(obj: Object, path: any): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    obj = obj[_path[i]] || path;
  }
  return typeof obj === 'string' ? obj as string : obj['default'] as string;
}

export function toHyphenCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function toClassNameValid(str: string) {
  const s = str.replace(/^[0-9]|[^\w\-]/g, _ => {
    return `_${_.charCodeAt(0)}`;
  });
  return toHyphenCase(s);
}

function toHyphenCaseCache(str: string) {
  return str in STYLE_KEYS_MAP
  ? STYLE_KEYS_MAP[str]
  : STYLE_KEYS_MAP[str] = toHyphenCase(str);
}

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

function toMedia(css: string, media: string) {
  return `@media ${media}{${css}}`;
}

function createNextId() {
  return `e${(nextId++).toString(36)}`;
}

type IClasses<T> = Record<(T extends ((...args: any[]) => any) ? (keyof ReturnType<T>) : keyof T), string>;
