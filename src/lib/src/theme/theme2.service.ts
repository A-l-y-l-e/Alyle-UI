import { Injectable, Renderer2, Inject, Optional, isDevMode, SkipSelf } from '@angular/core';
import { ThemeConfig, LY_THEME_NAME } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle, Style } from '../theme.service';
import { InvertMediaQuery } from '../media/invert-media-query';
import { Platform } from '../platform';

export interface StylesElementMap {
  el: any;
}

export enum TypeStyle {
  Multiple,
  OnlyOne
}

interface StyleMap03 {
  [id: string]: { // example: lyTabs
    styles: StylesFn2<any> | Styles2,
    media?: string,
    typeStyle?: TypeStyle,
    themes: { // example: minima-dark
      /** Css */
      default?: string,
      [themeName: string]: string
    }
  };
}

const STYLE_MAP_03: StyleMap03 = {} as any;

const STYLE_MAP: {
  [key: string]: Map<string, StylesElementMap>
} = {};
const CLASSES_MAP = {};
const STYLE_KEYS_MAP = {};
let nextId = 0;
function fn() {
  return CLASSES_MAP;
}
console.log({fn});
function fn2() {
  return STYLE_MAP_03;
}
console.log({fn2});

@Injectable({
  providedIn: 'root'
})
export class StylesInDocument {
  styles = new Set<string>();
}

@Injectable()
export class LyTheme2 {
  config: ThemeConfig;
  _styleMap: Map<string, DataStyle>;
  prefix = 'k';
  private _styleMap2: Map<string, StylesElementMap>;

  get classes() {
    return CLASSES_MAP;
  }

  constructor(
    private stylesInDocument: StylesInDocument,
    public core: CoreTheme,
    @Inject(LY_THEME_NAME) themeName
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
      console.log(themeName, this.config);
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
  addStyle<T>(id: string, style: Style<T>, el?: any, instance?: string) {
    const newClass = this.addCss(id, style as any);
    if (instance) {
      el.classList.remove(instance);
    }
    el.classList.add(newClass);
    return newClass;
  }
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
    for (const key in STYLE_MAP_03) {
      if (STYLE_MAP_03.hasOwnProperty(key)) {
        const { styles, typeStyle, media } = STYLE_MAP_03[key];
        this._createStyleContent2(styles, key, typeStyle, true, media);
      }
    }
    this._styleMap.forEach((dataStyle) => {
      dataStyle.styleElement.innerText = this.core._createStyleContent(this.config, dataStyle.style, dataStyle.id);
    });
  }

  /**
   * add style, similar to setUpStyle but this only accept string
   * @param id id of style
   * @param css style in string
   */
  private addCss(id: string, css: ((t) => string) | string, media?: string): string {
    const newId = `~>${id}`;
    this._createStyleContent2(css as any, newId, TypeStyle.OnlyOne, false, media);
    return CLASSES_MAP[newId];
  }

  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param id unique id for style group
   */
  addStyleSheet<T>(styles: StylesFn2<T> | Styles2, id?: string) {
    const newId = id || 'global';
    // const styleElement = this.core.renderer.createElement('style');
    this._createStyleContent2(styles, newId, TypeStyle.Multiple);
    return CLASSES_MAP[newId];
  }

  _createStyleContent2<T>(
    styles: StylesFn2<T> | Styles2,
    id: string,
    typeStyle: TypeStyle,
    forChangeTheme?: boolean,
    media?: string
  ) {
    const styleMap = id in STYLE_MAP_03
    ? STYLE_MAP_03[id]
    : STYLE_MAP_03[id] = {
      styles,
      media,
      typeStyle,
      themes: {} as any
    };
    if (!(styleMap.themes.default || this.config.name in styleMap.themes)) {
      let css;
      if (typeof styles === 'function') {
        css = groupStyleToString(styles(this.config), this.config.name, id, typeStyle, media);
        styleMap.themes[this.config.name] = css;
      } else {
        css = groupStyleToString(styles, this.config.name, id, typeStyle, media);
        styleMap.themes.default = css;
      }

      // this.core.renderer.appendChild(this.core.primaryStyleContainer, styleElement);
      if (!this._styleMap2.has(id)) {
        const styleElement = this.core.renderer.createElement('style');
        const styleText = this.core.renderer.createText(css);
        this.core.renderer.appendChild(styleElement, styleText);
        this._styleMap2.set(id, {
          el: styleElement
        });
      }
    }
    const style = this._styleMap2.get(id);
    if (!this.stylesInDocument.styles.has(id)) {
      this.stylesInDocument.styles.add(id);
      this.core.renderer.appendChild(this.core.primaryStyleContainer, style.el);
    }
    if (forChangeTheme && styleMap.themes[this.config.name]) {
      style.el.innerText = styleMap.themes[this.config.name];
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

function groupStyleToString(styles: Styles2, themeName: string, id: string, typeStyle: TypeStyle, media?: string) {
  // let newKey = '';
  // const string
  if (typeStyle === TypeStyle.OnlyOne) {
    const className = CLASSES_MAP[id] ? CLASSES_MAP[id] : CLASSES_MAP[id] = `e${(nextId++).toString(36)}`;
    if (typeof styles === 'string') {
      const css = `.${className}{${styles}}`;
      return media ? toMedia(css, media) : css;
    } else {
      return styleToString(styles, `.${className}`);
    }
  }
  let content = '';
  const classesMap = id in CLASSES_MAP
  ? CLASSES_MAP[id]
  : CLASSES_MAP[id] = {};
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const value = styles[key];
      if (typeof value === 'object') {
        const className = key in classesMap
        ? classesMap[key]
        : classesMap[key] = isDevMode() ? toClassNameValid(`${id}__${key}`) : `e${(nextId++).toString(36)}`;
        const style = styleToString(value as Styles2, `.${className}`);
        content += style;
      } else {
        console.log('value is string', value);
      }
    }
  }
  return content;
}

function createKeyFrame(name: string, ob: Object) {
  let content = `@keyframes ${name}{`;
  for (const key in ob) {
    if (ob.hasOwnProperty(key)) {
      const element = ob[key];
      content += `${key}% ${styleToString(element, '')}`;
    }
  }
  content += `}`;
  return content;
}
// console.log('keyframe', createKeyFrame('myanimation', keyFrameObject));

/**
 * {color:'red'} to .className{color: red}
 */
function styleToString(ob: Object, className?: string, parentClassName?: string) {
  let content = '';
  let keyAndValue = '';
  for (const styleKey in ob) {
    if (ob.hasOwnProperty(styleKey)) {
      const element = ob[styleKey];
      if (typeof element === 'object') {
        content += styleToString(element as Styles2, styleKey, className);
      } else {
        // const styleKeyHyphenCase = toHyphenCaseCache(styleKey);
        // const styleValue = styleKeyHyphenCase === 'font-size' && typeof element === 'number'
        // ? this.config.pxToRem(element)
        // : element;
        keyAndValue += `${toHyphenCaseCache(styleKey)}:${element};`;
      }
    }
  }
  if (className) {
    let newClassName = '';
    if (parentClassName) {
      newClassName += className.indexOf('&') === 0 ? `${parentClassName}${className.slice(1)}` : `${parentClassName} .${className}`;
    } else {
      newClassName += className;
    }
    content += `${newClassName}`;
  }
  content += `{${keyAndValue}}`;
  return content;
}


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
  const s = str.replace(/[\W]/g, '');
  return toHyphenCase(s[0].toLowerCase() + s.slice(1));
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

