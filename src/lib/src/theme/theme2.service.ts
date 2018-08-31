import { Injectable, Renderer2, Inject, isDevMode } from '@angular/core';
import { ThemeConfig, LY_THEME_NAME } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle, Style } from '../theme.service';
import { InvertMediaQuery } from '../media/invert-media-query';
import { Platform } from '../platform';
import { DOCUMENT } from '@angular/common';

const defaultStyles = {
  '@global': {
    '*, *:after, *:before': {
      '-webkit-box-sizing': 'border-box',
      '-moz-box-sizing': 'border-box',
      'box-sizing': 'border-box'
    }
  }
};

const REF_REG_EXP = /\{([\w-]+)\}/g;

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
      this.config = this.core.get(themeName);
      this._styleMap = new Map<string, DataStyle>();
      this.elements = themeName in this.stylesInDocument.styles
      ? this.stylesInDocument.styles[themeName]
      : this.stylesInDocument.styles[themeName] = {};
      this._createInstanceForTheme(themeName);
      if (!this.initialTheme) {
        this.initialTheme = this.config.name;
      }
      this._addDefaultStyles();
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
  addStyle(id: string, style: StyleContainer | ((theme) => StyleContainer) | ((theme) => string) | string, el?: any, instance?: string, priority?: number) {
    const newClass = this.addCss(id, style as any, priority);
    if (el) {
      if (instance) {
        el.classList.remove(instance);
      }
      el.classList.add(newClass);
    }
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
    if (nam !== this.config.name) {
      this.config = this.core.get(nam);

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
  private _addDefaultStyles() {
    this.addStyleSheet(defaultStyles, 'ly--defaultStyles');
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
    const themeName = this.initialTheme;
    const isCreated = (id in CLASSES_MAP) || CLASSES_MAP[themeName][id];
    if (!isCreated || forChangeTheme) {
      /** create new style for new theme */
      let css;
      if (typeof styles === 'function') {
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
    } else {
      /**
       * for ssr
       * append child style if not exist in dom
       */
      if (!Platform.isBrowser && !this.elements[id]) {
        const _css = styleMap.css[themeName] || styleMap.css;
        const element = this.elements[id] = this._createElementStyle(_css);
        this.core.renderer.appendChild(this._createStyleContainer(priority), element);
      }
    }

    const classes = typeof CLASSES_MAP[id] === 'string'
    ? CLASSES_MAP[id]
    : typeof CLASSES_MAP[id] === 'object'
    ? CLASSES_MAP[id]
    : CLASSES_MAP[themeName][id];
    return classes;
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
    return (key !== undefined && styleContainers.get(key)) || this.core.firstElement;
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
  if (typeStyle === TypeStyle.OnlyOne) {
    /** use current class or set new */
    const className = CLASSES_MAP[id]
    ? CLASSES_MAP[id] = _classes_ || createNextId()
    : CLASSES_MAP[themeName][id] = _classes_ || createNextId();
    if (typeof styles === 'string') {
      const css = `.${className}{${styles}}`;
      return media ? toMedia(css, media) : css;
    } else {
      const rules = styleToString(id, styles, className as any);
      return rules;
    }
  }
  let content = '';
  const classes = CLASSES_MAP[id]
  ? CLASSES_MAP[id] = _classes_ || {}
  : CLASSES_MAP[themeName][id] = _classes_ || {};
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const value = styles[key];
      if (typeof value === 'object') {
        const _className = classes[key] || (classes[key] = isDevMode() ? toClassNameValid(`${id}---${key}-${createNextId()}`) : createNextId());
        const style = styleToString(key, value as Styles2, _className);
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
