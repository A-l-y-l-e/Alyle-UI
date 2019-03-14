import { Injectable, Renderer2, Inject, isDevMode, NgZone } from '@angular/core';
import { LY_THEME_NAME, ThemeVariables } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle } from '../theme.service';
import { Platform } from '../platform';
import { DOCUMENT } from '@angular/common';
import { DirAlias, Dir } from '../style-utils';
import { YPosition } from '../position/position';

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
  styles: Styles;
  type: TypeStyle;
  priority?: number | null;
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
  /** Only for styles of TypeStyle.one */
  parentStyle?: Styles;
  requireUpdate?: boolean;
  id: string | null;
}

let nextClassId = 0;
let nextKeyFrameId = 0;

@Injectable({
  providedIn: 'root'
})
export class StylesInDocument {
  styles: {
    [themeName: string]: Map<string | Styles, HTMLStyleElement>
  } = {};
  styleContainers = new Map<number, HTMLElement>();
  styleElementGlobalMap = new Map<string | Styles, HTMLStyleElement>();
}

const THEME_MAP = new Map<string, {
  base: string
  change: string | null
}>();

@Injectable()
export class LyTheme2 {
  /**
   * @deprecated use `themeVariables` instead
   */
  config: ThemeVariables;
  _styleMap: Map<string, DataStyle>;
  initialTheme: string;
  elements: Map<string | Styles, HTMLStyleElement>;
  _elementsMap = new Map<any, HTMLStyleElement>();

  /** Get Theme Variables */
  get variables(): ThemeVariables {
    return this.config;
  }
  private themeMap = THEME_MAP;
  /** ssr or hmr */
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
      const theme = this.core.get(themeName);
      if (theme === undefined) {
        throw new Error(`Theme ${themeName} not found in CoreTheme`);
      }
      this.config = theme;
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
   * @param parentStyle
   */
  addStyle(id: string,
    style?: StyleDeclarationsBlock,
    el?: any,
    instance?: string | null,
    priority?: number | null,
    parentStyle?: Styles) {
    const newClass = this._createStyleContent2(style, id, priority, TypeStyle.OnlyOne, false, parentStyle) as string;
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

  /**
   * Create basic style
   * @param style Styles.
   * Note: Use only with inmutable variable.
   * @param priority Priority of style
   * @param parentStyle
   */
  style(style: StyleDeclarationsBlock, priority?: number | null, parentStyle?: Styles): string {
    return this._createStyleContent2(style,
      null,
      priority,
      TypeStyle.OnlyOne,
      false, parentStyle) as string;
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
      const theme = this.themeMap.get(this.initialTheme);
      if (theme == null) {
        throw new Error(`Theme ${nam} not found in themeMap`);
      }
      theme.change = nam;
      this.config = this.core.get(nam)!;
      this._updateAllStyles();
    }
  }

  /** Toggle right-to-left/left-to-right */
  toggleDirection() {
    const current = this.config.direction;
    this.config.direction = current === Dir.ltr ? Dir.rtl : Dir.ltr;
    this._updateAllStyles();
  }

  private _updateAllStyles() {
    this.elements.forEach((_, key) => {
      const styleData = STYLE_MAP5.get(key)!;
      if (styleData.requireUpdate) {
        this._createStyleContent2(styleData.styles, styleData.id, styleData.priority, styleData.type, true, styleData.parentStyle);
      }
    });
  }

  /**
   * Create a simple style
   * return className
   * @param id id of style
   * @param css style object or string
   * @param priority style priority(default: 0)
   */
  addSimpleStyle(id: string, css: StyleContainer | ((theme) => StyleContainer), priority?: number, parentStyle?: Styles): string {
    return this._createStyleContent2(css as any, id, priority, TypeStyle.OnlyOne, false, parentStyle) as string;
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

  private _createStyleContent2(
    styles: Styles | StyleDeclarationsBlock,
    id: string | null,
    priority: number | undefined | null,
    type: TypeStyle,
    forChangeTheme?: boolean,
    parentStyle?: Styles
  ) {
    const newId = id || styles as Styles;
    let isNewStyle: boolean | null = null;
    if (!STYLE_MAP5.has(newId)) {
      isNewStyle = true;
      STYLE_MAP5.set(newId, {
        priority,
        styles: styles as Styles,
        type,
        css: {},
        id,
        parentStyle
      });
    }
    const styleMap = STYLE_MAP5.get(newId)!;
    const themeName = this.initialTheme;
    const isCreated = isNewStyle || !(styleMap.classes || styleMap[themeName]);
    if (isCreated || forChangeTheme) {
      /** create new style for new theme */
      let css: string | { [themeName: string]: string; };
      const themeMap = this.themeMap.get(this.initialTheme)!;
      const config = this.core.get(themeMap.change || themeName) as ThemeVariables;
      if (typeof styles === 'function') {
        styleMap.requireUpdate = true;
        css = groupStyleToString(styleMap, styles(config) as StyleGroup, themeName, id, type, config);
        if (!forChangeTheme) {
          styleMap.css[themeName] = css;
        }
      } else {
        /** create a new id for style that does not <-<require>-> changes */
        css = groupStyleToString(styleMap, styles as StyleGroup, themeName, newId as string, type, config);
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
        const el = this.elements.get(newId) as HTMLStyleElement;
        el.innerText = css;
      }
    } else if (this.isDevOrServer) {
      /**
       * append child style if not exist in dom
       * for ssr or hmr
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

  private _createStyleContainer(priority: number | null | undefined) {
    priority = priority || 0;
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
/**
 * Style Object
 */
export interface StyleContainer {
  [key: string]: StyleContainer | string | number | string[] | null | undefined;
}

export interface StyleGroup {
  /** Prefix name */
  $name?: string;
  $keyframes?: Keyframes;
  [key: string]: StyleContainer | string | undefined | null;
}

/**
 * CSS declarations block
 */
export type StyleDeclarationsBlock = ((T: any) => StyleContainer | string) | StyleContainer | string | null | undefined;

export type Styles = ((T: any) => StyleGroup) | StyleGroup | undefined | null;

export interface Keyframes {
  [name: string]: {
    [percent: number]: StyleContainer
  };
}

function groupStyleToString(
  styleMap: StyleMap5,
  styles: StyleGroup,
  themeName: string,
  id: string | null,
  typeStyle: TypeStyle,
  themeVariables: ThemeVariables
) {
  // for styles type string
  if (typeStyle === TypeStyle.OnlyOne) {
    // use current class or set new
    const className = styleMap.requireUpdate
    ? styleMap[themeName] || (styleMap[themeName] = createNextClassId())
    : styleMap.classes
      ? styleMap.classes
      : styleMap.classes = createNextClassId();
    let rules: string;
    if (typeof styles === 'string') {
      rules = `.${className}{${styles}}`;
    } else {
      rules = styleToString(id, null, styles as StyleContainer, themeVariables, className as any);
    }
    if (styleMap.parentStyle) {
      const styleMapOfParentStyle = STYLE_MAP5.get(styleMap.parentStyle);
      if (!styleMapOfParentStyle) {
        throw new Error(`The parentStyle not exist or is called before being created.`);
      }
      return replaceRefs(rules, styleMapOfParentStyle[themeName]);
    }
    return rules;
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

        const style = styleToString(key, styles.$name, value as StyleGroup, themeVariables, currentClassName);
        content += style;
      }
    }
  }
  return replaceRefs(content, classesMap);
}

function replaceRefs(str: string, data: Object) {
  return str.replace(REF_REG_EXP, (_match, token) => {
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
function styleToString(key: string | null, $name: string | null | undefined, ob: StyleContainer, themeVariables: ThemeVariables, currentKey: string, parentKey?: string) {
  let content = '';
  let subContent = '';
  let keyAndValue = '';
  let newKey;
  if (parentKey) {
    if (currentKey.indexOf('&') !== -1) {
      newKey = currentKey.replace(/&/g, parentKey);
    } else if (currentKey.indexOf('@media') === 0) {
      newKey = `${currentKey}`;
    } else if (currentKey === '@global') {
      newKey = currentKey;
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
      // Omit style with value null
      if (element != null) {
        // Check if is Object literal
        if (element.constructor === Object) {
          subContent += styleToString(key, $name, element as StyleGroup, themeVariables, styleKey, newKey);
        } else {
          keyAndValue += convertToStyleValue(styleKey, element as string | string[], themeVariables);
        }
      }
    }
  }
  if (keyAndValue) {
    if (isDevMode()) {
      let lin = '\n\n';
      if ($name) {
        lin += `/** Style Sheet name: ${$name} */\n`;
      }
      lin += `/** Style Key: ${key} */\n`;
      content += `${lin}`;
    }
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

export function converterToCssKeyAndStyle(str: string, themeVariables: ThemeVariables) {
  const hyphenCase = toHyphenCase(str);
  if (hyphenCase.indexOf(DirAlias.before) !== -1) {
    return dirCache(str, hyphenCase, themeVariables, DirAlias.before);
  } else if (hyphenCase.indexOf(DirAlias.after) !== -1) {
    return dirCache(str, hyphenCase, themeVariables, DirAlias.after);
  } else if (hyphenCase.indexOf(YPosition.above) !== -1) {
    return YPositionCache(str, hyphenCase, themeVariables, YPosition.above, TOP);
  } else if (hyphenCase.indexOf(YPosition.below) !== -1) {
    return YPositionCache(str, hyphenCase, themeVariables, YPosition.below, BOTTOM);
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

const BOTTOM = 'bottom';
const TOP = 'top';

function dirCache(original, val: string, themeVariables: ThemeVariables, dirAlias: DirAlias) {
  const map = STYLE_KEYS_MAP[themeVariables.direction];
  // Replace in original, for do not repeat this again
  return map[original] = val.replace(dirAlias, themeVariables.getDirection(dirAlias));
}

function YPositionCache(original, val: string, themeVariables: ThemeVariables, pos: YPosition, to: 'top' | 'bottom') {
  const map = STYLE_KEYS_MAP[themeVariables.direction];
  // Replace in original, for do not repeat this again
  return map[original] = val.replace(pos, to);
}

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

function createNextClassId() {
  return `i${(nextClassId++).toString(36)}`;
}
function createNextKeyframeId() {
  return `k${(nextKeyFrameId++).toString(36)}`;
}

// Convert all properties to `string` type, and exclude properties that not is class name
type OnlyClasses<T> = Record<(
  Exclude<(T extends ((...args: any[]) => any) ? (keyof ReturnType<T>) : keyof T),
  '$name' | '$keyframes' | '@global'>
), string>;

