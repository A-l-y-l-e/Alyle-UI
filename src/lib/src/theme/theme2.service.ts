import { Injectable, Renderer2, Inject, isDevMode } from '@angular/core';
import { LY_THEME_NAME, ThemeVariables } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle } from '../theme.service';
import { Platform } from '../platform';
import { DOCUMENT } from '@angular/common';
import { DirAlias } from '../style-utils';

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
  id: string;
}
const STYLE_KEYS_MAP = {};
let nextClassId = 0;

@Injectable({
  providedIn: 'root'
})
export class StylesInDocument {
  styles: {
    [themeName: string]: Map<string | object, HTMLStyleElement>
  } = {};
  styleContainers = new Map<number, HTMLElement>();
  styleElementGlobalMap = new Map<string | object, HTMLStyleElement>();
}

const THEME_MAP = new Map<string, {
  base: string
  change: string | null
}>();

@Injectable()
export class LyTheme2 {
  config: ThemeVariables;
  _styleMap: Map<string, DataStyle>;
  initialTheme: string;
  elements: Map<string | object, HTMLStyleElement>;
  _elementsMap = new Map<any, HTMLStyleElement>();
  private themeMap = THEME_MAP;

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
      if (!this.initialTheme) {
        this.initialTheme = this.config.name;
      }
      if (!this.themeMap.has(this.initialTheme)) {
        this.themeMap.set(this.initialTheme, {
          base: this.initialTheme,
          change: null
        });
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
      this.themeMap.get(this.initialTheme).change = nam;
      this.config = this.core.get(nam);
      this.elements.forEach((_, key) => {
        const styleData = STYLE_MAP5.get(key);
        if (styleData.requireUpdate) {
          this._createStyleContent2(styleData.styles, styleData.id, styleData.priority, styleData.type, true);
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


  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param priority priority for style
   */
  addStyleSheet<T>(styles: T & (StylesFn2<T> | Styles2), priority?: number): IClasses<T> {
    return this._createStyleContent2(styles, null, priority, TypeStyle.Multiple);
  }

  private _createStyleContent2<T>(
    styles: StylesFn2<T> | Styles2,
    id: string,
    priority: number,
    type: TypeStyle,
    forChangeTheme?: boolean,
    media?: string
  ) {
    const newId = id as string || styles;
    let isNewStyle: boolean;
    if (!STYLE_MAP5.has(newId)) {
      isNewStyle = true;
      STYLE_MAP5.set(newId, {
        priority,
        styles,
        type,
        css: {},
        id
      });
    }
    const styleMap = STYLE_MAP5.get(newId);
    const themeName = this.initialTheme;
    const isCreated = isNewStyle || !(styleMap.classes || styleMap[themeName]);
    if (isCreated || forChangeTheme) {
      /** create new style for new theme */
      let css;
      const themeMap = this.themeMap.get(this.initialTheme);
      const config = this.core.get(themeMap.change || themeName);
      if (typeof styles === 'function') {
        styleMap.requireUpdate = true;
        css = groupStyleToString(styleMap, styles(config), themeName, null, type, config, media);
        if (!forChangeTheme) {
          styleMap.css[themeName] = css;
        }
      } else {
        /** create a new id for style that does not <-<require>-> changes */
        css = groupStyleToString(styleMap, styles, themeName, newId as string, type, config, media);
        styleMap.css = css;
      }

      if (newId === `~>lyButton.size:medium`) {
        console.log(newId, this.elements.has(newId));
      }
      if (!this.elements.has(newId)) {
        const newEl = this._createElementStyle(css);
        if (styleMap.requireUpdate) {
          this.elements.set(newId, newEl);
        } else {
          this.stylesInDocument.styleElementGlobalMap.set(newId, newEl);
        }
        this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), newEl);
      }
      const el = this.elements.get(newId);
      if (forChangeTheme) {
        el.innerText = css;
      }
    } else if (isDevMode() || !Platform.isBrowser) {
      /**
       * append child style if not exist in dom
       * for ssr & hmr
       */
      if (!this.elements.has(newId)) {
        const _css = styleMap.css[themeName] || styleMap.css;
        const map = this.stylesInDocument.styleElementGlobalMap;
        if (styleMap.requireUpdate) {
          this.elements.set(newId, this._createElementStyle(_css));
          this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), this.elements.get(newId));
        } else if (!map.has(newId)) {
          map.set(newId, this._createElementStyle(_css));
          this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), this.elements.get(newId));
        }
      }
    }
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
  themeVariables: ThemeVariables,
  media?: string
) {
  if (typeStyle === TypeStyle.OnlyOne) {
    // use current class or set new
    const className = styleMap.requireUpdate
    ? styleMap[themeName] || (styleMap[themeName] = createNextClassId())
    : styleMap.classes
      ? styleMap.classes
      : styleMap.classes = createNextClassId();
    if (typeof styles === 'string') {
      const css = `.${className}{${styles}}`;
      return media ? toMedia(css, media) : css;
    } else {
      const rules = styleToString(id, styles, themeVariables, className as any);
      return rules;
    }
  }
  // for multiples styles
  const classesMap = styleMap[themeName] || (styleMap[themeName] = {});
  let content = '';
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      // set new id if not exist
      const currentClassName = key in classesMap
      ? classesMap[key]
      : classesMap[key] = isDevMode() ? toClassNameValid(`i-${key}-${createNextClassId()}`) : createNextClassId();
      const value = styles[key];
      if (typeof value === 'object') {
        const style = styleToString(key, value as Styles2, themeVariables, currentClassName);
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
function styleToString(key: string, ob: Object, themeVariables: ThemeVariables, currentKey: string, parentKey?: string) {
  let content = '';
  let subContent = '';
  let keyAndValue = '';
  let newKey;
  if (parentKey) {
    if (currentKey.indexOf('&') !== -1) {
      newKey = currentKey.replace(/&/g, parentKey);
    } else if (currentKey.indexOf('@media') === 0) {
      newKey = `${currentKey}`;
    } else {
      newKey = `${parentKey} ${currentKey}`;
    }
  } else if (key === '@global') {
    newKey = key;
  } else {
    newKey = `.${currentKey}`;
  }
  for (const styleKey in ob) {
    if (ob.hasOwnProperty(styleKey)) {
      const element = ob[styleKey];
      if (typeof element === 'object') {
        subContent += styleToString(key, element as Styles2, themeVariables, styleKey, newKey);
      } else {
        let newStyleKey = toHyphenCaseCache(styleKey);
        if (newStyleKey.indexOf(DirAlias.start) !== -1) {
          newStyleKey = dirCache(newStyleKey, themeVariables, DirAlias.start);
        } else if (newStyleKey.indexOf(DirAlias.end) !== -1) {
          newStyleKey = dirCache(newStyleKey, themeVariables, DirAlias.end);
        }
        keyAndValue += `${newStyleKey}:${element};`;
      }
    }
  }
  if (keyAndValue) {
    if (newKey.indexOf('@media') === 0) {
      content += `${newKey}`;
      keyAndValue = `${parentKey}{${keyAndValue}}`;
    } else if (parentKey && parentKey === '@global') {
      content += `${currentKey}`;
    } else {
      content += `${newKey}`;
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

function toHyphenCaseCache(str: string): string {
  return str in STYLE_KEYS_MAP
  ? STYLE_KEYS_MAP[str]
  : STYLE_KEYS_MAP[str] = toHyphenCase(str);
}

const STYLE_KEYS_DIRECTIONS_MAP = {};

function dirCache(val: string, themeVariables: ThemeVariables, dirAlias: DirAlias) {
  const newKey = themeVariables.direction + val;
  return newKey in STYLE_KEYS_DIRECTIONS_MAP
  ? STYLE_KEYS_DIRECTIONS_MAP[newKey]
  : STYLE_KEYS_DIRECTIONS_MAP[newKey] = val.replace(dirAlias, themeVariables.getDirection(dirAlias));
}

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

function toMedia(css: string, media: string) {
  return `@media ${media}{${css}}`;
}

function createNextClassId() {
  return `i${(nextClassId++).toString(36)}`;
}

type IClasses<T> = Record<(T extends ((...args: any[]) => any) ? (keyof ReturnType<T>) : keyof T), string>;
