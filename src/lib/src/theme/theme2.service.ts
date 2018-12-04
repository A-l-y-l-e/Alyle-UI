import { Injectable, Renderer2, Inject, isDevMode, NgZone } from '@angular/core';
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
  styles: StylesFn2 | Styles2;
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

let nextClassId = 0;
let nextKeyFrameId = 0;

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
  private isDevOrServer = isDevMode() || !Platform.isBrowser;

  constructor(
    private stylesInDocument: StylesInDocument,
    public core: CoreTheme,
    @Inject(LY_THEME_NAME) themeName,
    @Inject(DOCUMENT) private _document: any,
    private _ngZone: NgZone
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
  addStyleSheet<T>(styles: T & Styles, priority?: number): OnlyClasses<T> {
    return this._createStyleContent2(styles, null, priority, TypeStyle.Multiple);
  }

  private _createStyleContent2<T>(
    styles: StylesFn2 | Styles2,
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
      if (!this.elements.has(newId)) {
        const newEl = this._createElementStyle(css);
        if (styleMap.requireUpdate) {
          // This is required for when a theme changes
          this.elements.set(newId, newEl);
        } else if (this.isDevOrServer) {
          // in dev mode or server it is not necessary
          // since the styles will not change
          this.stylesInDocument.styleElementGlobalMap.set(newId, newEl);
        }
        this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), newEl);
      }
      if (forChangeTheme) {
        const el = this.elements.get(newId);
        el.innerText = css;
      }
    } else if (this.isDevOrServer) {
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
          this.core.renderer.appendChild(this._createStyleContainer(styleMap.priority), map.get(newId));
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

  requestAnimationFrame(fn: (...args: any[]) => void) {
    if (typeof requestAnimationFrame === 'function') {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          fn();
        });
      });
    } else {
      fn();
    }
  }

}

export interface StyleContainer {
  [key: string]: StyleContainer | string | number | string[];
}

export interface Styles2 {
  /** Prefix name */
  $name?: string;
  [key: string]: StyleContainer | string;
}
export type StylesFn2 = (T) => Styles2;

export type Styles = StylesFn2 | Styles2;

export interface Keyframes {
  [name: string]: {
    [percent: number]: StyleContainer
  };
}

function groupStyleToString(
  styleMap: StyleMap5,
  styles: Styles2,
  themeName: string,
  id: string,
  typeStyle: TypeStyle,
  themeVariables: ThemeVariables,
  media?: string
) {
  // for styles type string
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
  const name = styles.$name ? `${styles.$name}-` : '';
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const value = styles[key];
      if (key === '$keyframes') {
        content += keyframesToString(name, classesMap, value as Keyframes, themeVariables);
      } else if (typeof value === 'object' || value === null) {
        // set new id if not exist
        const currentClassName = key in classesMap
        ? classesMap[key]
        : classesMap[key] = isDevMode() ? toClassNameValid(`y-${name}${key}-${createNextClassId()}`) : createNextClassId();

        const style = styleToString(key, value as Styles2, themeVariables, currentClassName);
        content += style;
      }
    }
  }
  return replaceRefs(content, classesMap);
}

function replaceRefs(str: string, data: Object) {
  return str.replace(REF_REG_EXP, (match, token) => {
    const className = data[token];
    if (className) {
      return `.${data[token]}`;
    } else {
      return data[`@г.->-${token}`];
    }
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
      // Check if is Object literal
      if (element.constructor === Object) {
        subContent += styleToString(key, element as Styles2, themeVariables, styleKey, newKey);
      } else {
        keyAndValue += convertToStyleValue(styleKey, element, themeVariables);
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

function convertToStyleValue(key: string, value: string | string[], themeVariables: ThemeVariables) {
  const newStyleKey = converterToCssKeyAndStyleCache(key, themeVariables);
  if (value.constructor === Array) {
    let lin = '';
    for (let index = 0; index < value.length; index++) {
      lin += `${newStyleKey}:${value[index]};`;
    }
    return lin;
  } else {
    return `${newStyleKey}:${value};`;
  }
}

function keyframesToString(styleName: string, keysMap: object, keyframes: Keyframes, themeVariables: ThemeVariables) {
  let content = '';

  for (const name in keyframes) {
    if (keyframes.hasOwnProperty(name)) {
      const keyframe = keyframes[name];
      // Sometimes the name of a class can be the same as the name of a keyframe,
      // so we add a character to be different
      const newUniqueName = `@г.->-${name}`;
      // set new id if not exist
      const newName = newUniqueName in keysMap
      ? keysMap[newUniqueName]
      : keysMap[newUniqueName] = isDevMode() ? toClassNameValid(`${styleName}${name}-${createNextKeyframeId()}-v`) : createNextKeyframeId();
      content += `@keyframes ${newName}{`;
      for (const percent in keyframe) {
        if (keyframe.hasOwnProperty(percent)) {
          content += `${percent}%{`;
          const styles = keyframe[percent];
          for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
              const val = styles[key];
              content += convertToStyleValue(key, val as string | string[], themeVariables);
            }
          }
          content += `}`;
        }
      }
      content += `}`;
    }
  }
  return content;
}

function warnDeprecatedKeyStyle(str: string, key: string, to: string) {
  console.warn(`Style key \`${key}\` deprecated for \`${str}\`, change \`${key}\` to \`${to}\`\n`);
}

export function converterToCssKeyAndStyle(str: string, themeVariables: ThemeVariables) {
  const hyphenCase = toHyphenCase(str);
  if (hyphenCase.indexOf(DirAlias.start) !== -1) {
    warnDeprecatedKeyStyle(str, DirAlias.start, DirAlias.before);
    return dirCache(str, hyphenCase, themeVariables, DirAlias.start);
  } else if (hyphenCase.indexOf(DirAlias.end) !== -1) {
    warnDeprecatedKeyStyle(str, DirAlias.end, DirAlias.after);
    return dirCache(str, hyphenCase, themeVariables, DirAlias.end);
  } else if (hyphenCase.indexOf(DirAlias.before) !== -1) {
    return dirCache(str, hyphenCase, themeVariables, DirAlias.before);
  } else if (hyphenCase.indexOf(DirAlias.after) !== -1) {
    return dirCache(str, hyphenCase, themeVariables, DirAlias.after);
  }
  return hyphenCase;
}

function toClassNameValid(str: string) {
  const s = str.replace(/^[0-9]|[^\w\-]/g, _ => {
    return `_${_.charCodeAt(0)}`;
  });
  return toHyphenCase(s);
}


function toHyphenCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function converterToCssKeyAndStyleCache(str: string, themeVariables: ThemeVariables): string {
  const map = STYLE_KEYS_MAP[themeVariables.direction];
  return str in map
  ? map[str]
  : map[str] = converterToCssKeyAndStyle(str, themeVariables);
}

const ignoreCSSKEY = {
  'break-after': 'break-after',
  'break-before': 'break-before',
  'page-break-after': 'page-break-after',
  'page-break-before': 'page-break-before'
};

const STYLE_KEYS_MAP = {
  rtl: {
    ...ignoreCSSKEY
  },
  ltr: {
    ...ignoreCSSKEY
  }
};

function dirCache(original, val: string, themeVariables: ThemeVariables, dirAlias: DirAlias) {
  const map = STYLE_KEYS_MAP[themeVariables.direction];
  // Replace in original, for do not repeat this again
  return map[original] = val.replace(dirAlias, themeVariables.getDirection(dirAlias));
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
function createNextKeyframeId() {
  return `k${(nextKeyFrameId++).toString(36)}`;
}

type OnlyClasses<T> = Record<(
  Exclude<(T extends ((...args: any[]) => any) ? (keyof ReturnType<T>) : keyof T),
  '$name' | '$sheet' | '$keyframes'>
), string>;

