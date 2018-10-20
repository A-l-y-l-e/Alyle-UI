import { Injectable, Renderer2, Inject, isDevMode } from '@angular/core';
import { LY_THEME_NAME, ThemeVariables } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle } from '../theme.service';
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

const STYLE_MAP5: Map<any, StyleMap5> = new Map();

export interface StyleMap5 {
  styles: StylesFn2<any> | Styles2;
  type: TypeStyle;
  priority: number;
  css: {
    [themeName: string]: string
  } | string;
  /** global theme */
  classes?: {
    [key: string]: string
  } | string;
  /** requireUpdate */
  classesWithTheme?: {
    [themeName: string]: {
      [key: string]: string
    } | string
  };
  requireUpdate?: boolean;
}
const CLASSES_MAP: {
  [idOrThemeName: string]: {
    [className: string]: string
  } | string
} = {};
const STYLE_KEYS_MAP = {};
let nextId = 0;
let nextClassId = 0;
function fn() {
  return CLASSES_MAP;
}
console.log({fn});
console.log(STYLE_MAP5);

@Injectable({
  providedIn: 'root'
})
export class StylesInDocument {
  styles: {
    [themeName: string]: Map<string | object, HTMLStyleElement>
  } = {};
  styleContainers = new Map<number, HTMLElement>();
}

@Injectable()
export class LyTheme2 {
  config: ThemeVariables;
  _styleMap: Map<string, DataStyle>;
  initialTheme: string;
  elements: Map<string | object, HTMLStyleElement>;
  _elementsMap = new Map<any, HTMLStyleElement>();

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
      : this.stylesInDocument.styles[themeName] = new Map();
      this._createInstanceForTheme(themeName);
      if (!this.initialTheme) {
        this.initialTheme = this.config.name;
      }
      this._addDefaultStyles();
    }
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
    if (newClass === instance) {
      return newClass;
    }
    if (el) {
      if (instance) {
        el.classList.remove(instance);
      }
      el.classList.add(newClass);
    }
    return newClass;
  }
  private updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    this.core.updateClassName(element, renderer, newClassname, oldClassname);
  }
  updateClass(element: any, renderer: Renderer2, newClass: string, oldClass?: string) {
    if (newClass === oldClass) {
      return newClass;
    }
    this.updateClassName(element, renderer, newClass, oldClass);
    return newClass;
  }
  setTheme(nam: string) {
    if (!Platform.isBrowser) {
      throw new Error(`\`theme.setTheme('theme-name')\` is only available in browser platform`);
    }
    if (nam !== this.config.name) {
      this.config = this.core.get(nam);
      this.elements.forEach((_, key) => {
        const styleData = STYLE_MAP5.get(key);
        if (styleData.requireUpdate) {
          this._createStyleContent2(styleData.styles, key, styleData.priority, styleData.type, true);
        }
      });
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
    this.addStyleSheet(defaultStyles);
  }

  addStyleSheet<T>(styles: T & (StylesFn2<T> | Styles2), priority?: number): IClasses<T>;
  addStyleSheet<T>(styles: T & (StylesFn2<T> | Styles2), id: string): IClasses<T>;
  addStyleSheet<T>(styles: T & (StylesFn2<T> | Styles2), id: string | string, priority: number): IClasses<T>;

  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param id deprecated, unique id for style group
   * @param priority priority for style
   */
  addStyleSheet<T>(styles: T & (StylesFn2<T> | Styles2), id?: string | number, priority?: number): IClasses<T> {
    if (isDevMode() && void 0 === priority && typeof id === 'string') {
      console.warn(`the value \`${id}\` is no longer necessary for addStyleSheet, this will be an error in the next release.`);
    }
    return this._createStyleContent2(styles, id as any, priority, TypeStyle.Multiple);
  }

  private _createStyleContent2<T>(
    styles: StylesFn2<T> | Styles2,
    id: string | object | number,
    priority: number,
    type: TypeStyle,
    forChangeTheme?: boolean,
    media?: string
  ) {
    // const styleMap = (id in STYLE_MAP4
    // ? STYLE_MAP4[id]
    // : STYLE_MAP4[id] = {
    //   priority,
    //   styles,
    //   type,
    //   css: {}
    // });
    const newId = type === TypeStyle.OnlyOne ? id as string : styles;
    let isNewStyle: boolean;
    if (!STYLE_MAP5.has(newId)) {
      isNewStyle = true;
      STYLE_MAP5.set(newId, {
        priority: type === TypeStyle.OnlyOne ? priority : priority === void 0 && typeof id === 'number' ? id as number : priority,
        styles,
        type,
        css: {}
      });
    }
    const styleMap = STYLE_MAP5.get(newId);
    const themeName = this.initialTheme;
    const isCreated = isNewStyle || !(styleMap.classes || styleMap[themeName]);
    if (isCreated || forChangeTheme) {
      /** create new style for new theme */
      let css;
      if (typeof styles === 'function') {
        styleMap.requireUpdate = true;
        css = groupStyleToString(styleMap, styles(this.config), themeName, null, type, media);
        if (!forChangeTheme) {
          styleMap.css[themeName] = css;

        }
      } else {
        /** create a new id for style that does not <-<require>-> changes */
        // CLASSES_MAP[id] = true as any;
        css = groupStyleToString(styleMap, styles, themeName, newId as string, type, media);
        styleMap.css = css;
      }
      if (!this.elements.has(newId)) {
        this.elements.set(newId, this._createElementStyle(css));
      }
      const el = this.elements.get(newId);
      if (forChangeTheme) {
        el.innerText = css;
      } else {
        this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), el);
      }
    } else {
      /**
       * append child style if not exist in dom
       * for ssr & hmr
       */
      if (!this.elements.has(newId)) {
        const _css = styleMap.css[themeName] || styleMap.css;
        this.elements.set(newId, this._createElementStyle(_css));
        this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), this.elements.get(newId));
      }
    }

    // const classes = typeof CLASSES_MAP[id] === 'string'
    // ? CLASSES_MAP[id]
    // : typeof CLASSES_MAP[id] === 'object'
    // ? CLASSES_MAP[id]
    // : CLASSES_MAP[themeName][id];
    // return classes;
    return styleMap.classes || styleMap[themeName];
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

function groupStyleToString(
  styleMap: StyleMap5,
  styles: Styles2,
  themeName: string,
  id: string,
  typeStyle: TypeStyle,
  media?: string
) {
  if (typeStyle === TypeStyle.OnlyOne) {
    // styleMap.classes = createNextClassId();
    /** use current class or set new */
    // const className = CLASSES_MAP[id]
    // ? CLASSES_MAP[id] = _classes_ || createNextId()
    // : CLASSES_MAP[themeName][id] = _classes_ || createNextId();
    const className = styleMap.requireUpdate
    ? styleMap[themeName] || (styleMap[themeName] = createNextClassId())
    : styleMap.classes
      ? styleMap.classes
      : styleMap.classes = createNextClassId();
    if (typeof styles === 'string') {
      const css = `.${className}{${styles}}`;
      return media ? toMedia(css, media) : css;
    } else {
      const rules = styleToString(id, styles, className as any);
      return rules;
    }
  }
  // for multiples styles
  const classesMap = styleMap[themeName] || (styleMap[themeName] = {});
  let content = '';
  // const classes = CLASSES_MAP[id]
  // ? CLASSES_MAP[id] = _classes_ || {}
  // : CLASSES_MAP[themeName][id] = _classes_ || {};
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      // set new id if not exist
      const currentClassName = key in classesMap
      ? classesMap[key]
      : classesMap[key] = isDevMode() ? toClassNameValid(`i---${key}-${createNextClassId()}`) : createNextClassId();
      const value = styles[key];
      if (typeof value === 'object') {
        // const _className = classes[key] || (classes[key] = isDevMode() ? toClassNameValid(`${id}---${key}-${createNextId()}`) : createNextId());
        const style = styleToString(key, value as Styles2, currentClassName);
        content += style;
      } else {
        console.log('value is string', value);
      }
    }
  }
  return replaceRefs(content, classesMap);
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
function createNextClassId() {
  return `i${(nextClassId++).toString(36)}`;
}

type IClasses<T> = Record<(T extends ((...args: any[]) => any) ? (keyof ReturnType<T>) : keyof T), string>;
