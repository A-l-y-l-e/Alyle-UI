import { Injectable, Renderer2, Inject, isDevMode, NgZone, Optional } from '@angular/core';
import { LY_THEME_NAME, ThemeVariables, LY_THEME, LY_THEME_GLOBAL_VARIABLES, ThemeConfig } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle } from '../theme.service';
import { DOCUMENT } from '@angular/common';
import { DirAlias, Dir } from '../style-utils';
import { YPosition } from '../position/position';
import { StyleMap5,
  StyleGroup,
  TypeStyle,
  StyleContainer,
  _STYLE_MAP,
  Styles,
  StyleDeclarationsBlock,
  KeyframesDeprecated,
  LyClasses,
  getThemeNameForSelectors,
  LyStyles } from './style';
import { Subject } from 'rxjs';
import { StyleTemplate, StringIdGenerator } from '../parse';
import { Platform } from '@angular/cdk/platform';

const REF_REG_EXP = /\{([\w-]+)\}/g;

let nextKeyFrameId = 0;
const yClassID = new StringIdGenerator();
export const keyframesUniqueId = new StringIdGenerator();

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

  /** Event emitted when the direction has changed. */
  private _directionChanged = new Subject<void>();
  get directionChanged() {
    return this._directionChanged.asObservable();
  }

  /** Event emitted when the theme has changed. */
  private _themeChanged = new Subject<void>();
  readonly themeChanged = this._themeChanged.asObservable();

  /** Get Theme Variables */
  get variables(): ThemeVariables {
    return this.config;
  }
  private themeMap = THEME_MAP;
  /** ssr or hmr */
  private isDevOrServer = isDevMode() || !this._platform.isBrowser;
  protected _document: Document;


  constructor(
    private stylesInDocument: StylesInDocument,
    public core: CoreTheme,
    @Inject(LY_THEME_NAME) themeName,
    @Optional() @Inject(LY_THEME) themeConfig: ThemeConfig[] | ThemeConfig,
    @Optional() @Inject(LY_THEME_GLOBAL_VARIABLES) globalVariables: ThemeConfig,
    @Inject(DOCUMENT) _document: any,
    private _ngZone: NgZone,
    private _platform: Platform
  ) {
    this._document = _document;
    if (themeConfig) {
      core.initializeTheme(themeConfig, globalVariables);
    }
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
    }
  }

  /**
   * Build multiple styles and render them in the DOM
   */
  renderStyleSheet<T>(styles: T & LyStyles): LyClasses<T> {
    return this._createStyleContent2(styles, null, null, TypeStyle.Multiple);
  }

  renderStyle<THEME_VARIABLES>(
    id: string,
    style: (theme: THEME_VARIABLES, ref: ThemeRef) => StyleTemplate,
    priority?: number
  ): string;

  renderStyle<THEME_VARIABLES>(
    style: (theme: THEME_VARIABLES, ref: ThemeRef) => StyleTemplate,
    priority?: number
  ): string;
  /**
   * Build the styles and render them in the DOM
   */
  renderStyle<THEME_VARIABLES>(
    styleOrId: ((theme: THEME_VARIABLES, ref: ThemeRef) => StyleTemplate) | string,
    priorityOrStyle?: number | ((theme: THEME_VARIABLES, ref: ThemeRef) => StyleTemplate),
    priority?: number
  ): string {
    if (typeof styleOrId === 'string') {
      return this._createStyleContent2(priorityOrStyle as (theme: THEME_VARIABLES, ref: ThemeRef) => StyleTemplate,
        styleOrId,
        priority,
        TypeStyle.LylStyle);
    }
    return this._createStyleContent2(styleOrId,
      null,
      priorityOrStyle as number,
      TypeStyle.LylStyle);
  }

  /**
   * Add a new dynamic style, use only within @Input()
   * @param id Unique id
   * @param style Styles
   * @param el Element
   * @param instance The instance of this, this replaces the existing style with a new one when it changes
   * @param parentStyle Parent Style
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
   * Note: Use only with immutable variable.
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

  /**
   * Change the current theme for another.
   * @param themeName theme name
   */
  setTheme(themeName: string) {
    if (!this._platform.isBrowser) {
      throw new Error(`\`theme.setTheme('theme-name')\` is only available in browser platform`);
    }
    if (themeName !== this.config.name) {
      const theme = this.themeMap.get(this.initialTheme);
      if (theme == null) {
        throw new Error(`Theme ${themeName} not found in themeMap`);
      }
      theme.change = themeName;
      this.config = this.core.get(themeName)!;
      this._updateAllStyles();
      this._themeChanged.next();
    }
  }

  /** Toggle right-to-left/left-to-right */
  toggleDirection() {
    const current = this.config.direction;
    this.config.direction = current === Dir.ltr ? Dir.rtl : Dir.ltr;
    this._updateAllStyles();
    this._directionChanged.next();
  }

  setDirection(dir: Dir | `${Dir}`) {
    if (this.config.direction !== dir) {
      this.config.direction = dir;
      this._updateAllStyles();
      this._directionChanged.next();
    }
  }

  private _updateAllStyles() {
    this.elements.forEach((_, key) => {
      const styleData = _STYLE_MAP.get(key)!;
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


  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param priority priority for style
   */
  addStyleSheet<T>(styles: T & Styles, priority?: number): LyClasses<T> {
    return this._createStyleContent2(styles, null, priority, TypeStyle.Multiple);
  }

  /**
   * Check if a style exist
   * @param stylesOrId Style or Id of a style
   */
  existStyle(stylesOrId: string | Styles | StyleDeclarationsBlock): boolean {
    if (_STYLE_MAP.has(stylesOrId)) {
      const styleMap = _STYLE_MAP.get(stylesOrId)!;
      return !!(styleMap.classes || styleMap[this.initialTheme]);
    }
    return false;
  }

  /**
   * return selectors if exists
   *
   * e.g.
   *
   * ```ts
   * {
   *   root: '.c'
   * }
   * ```
   * @param styles id
   */
  selectorsOf<T>(styles: T): LyClasses<T> {
    const themeName = this.initialTheme;
    if (!_STYLE_MAP.has(styles)) {
      _STYLE_MAP.set(styles, {
        isNewStyle: true,
        styles: styles as unknown as Styles,
        type: TypeStyle.Multiple,
        css: {},
        id: null
      });
    }
    const styleMap = _STYLE_MAP.get(styles)!;
    const themeNameForSelectors = getThemeNameForSelectors(themeName);
    const classesMap = styleMap[themeNameForSelectors] || (styleMap[themeNameForSelectors] = {});
    return classesMap;
  }

  selectorOf(styles: string | StyleTemplate): string {
    const themeName = this.initialTheme;
    const styleMap = _STYLE_MAP.get(styles)!;
    return styleMap.classes || styleMap[themeName];
  }

  /**
   * For internal use only
   * @docs-private
   */
  _createStyleContent2(
    styles: Styles
      | StyleDeclarationsBlock
      | ((theme: any, ref: ThemeRef) => StyleTemplate),
    id: string | null,
    priority: number | undefined | null,
    type: TypeStyle,
    forChangeTheme?: boolean,
    parentStyle?: Styles
  ) {
    const newId = id || styles as Styles;
    if (!_STYLE_MAP.has(newId)) {
      _STYLE_MAP.set(newId, {
        isNewStyle: true,
        priority,
        styles: styles as Styles,
        type,
        css: {},
        id,
        parentStyle
      });
    }
    const styleMap = _STYLE_MAP.get(newId)!;
    const themeName = this.initialTheme;
    const isCreated = styleMap.isNewStyle || !(styleMap.classes || styleMap[themeName]);
    if (isCreated || forChangeTheme) {
      styleMap.isNewStyle = false;
      // create new style for new theme
      let css: string | { [themeName: string]: string; };
      const themeMap = this.themeMap.get(this.initialTheme)!;
      const config = this.core.get(themeMap.change || themeName) as ThemeVariables;
      if (typeof styles === 'function') {
        styleMap.requireUpdate = true;
        css = type === TypeStyle.LylStyle
          ? createLylStyle(
              styleMap,
              (styles as ((theme: any, ref: ThemeRef) => StyleTemplate))(config, this),
              themeName, this.core.classNamePrefix)
          : groupStyleToString(styleMap, styles(config, this) as StyleGroup, themeName, id, type, config, this.core.classNamePrefix);
        if (!forChangeTheme) {
          styleMap.css[themeName] = css;
        }
      } else {
        /** create a new id for style that does not <-<require>-> changes */
        css = groupStyleToString(styleMap, styles as StyleGroup, themeName, newId as string, type, config, this.core.classNamePrefix);
        styleMap.css = css;
      }
      if (!this.elements.has(newId)) {
        const newEl = this._createStyleElement();
        if (styleMap.requireUpdate) {
          // This is required for when a theme changes
          this.elements.set(newId, newEl);
        } else if (this.isDevOrServer) {
          // in dev mode or server it is not necessary
          // since the styles will not change
          this.stylesInDocument.styleElementGlobalMap.set(newId, newEl);
        }
        this._renderCss(newEl, css, styleMap.priority);
      }
      if (forChangeTheme) {
        const el = this.elements.get(newId) as HTMLStyleElement;
        el.removeChild(el.firstChild!);
        el.appendChild(this._document.createTextNode(css));
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
          const styleElement = this._createStyleElement();
          this.elements.set(newId, styleElement);
          this._renderCss(styleElement, _css, styleMap.priority);
        } else if (!map.has(newId)) {
          const styleElement = this._createStyleElement();
          map.set(newId, styleElement);
          this._renderCss(styleElement, _css, styleMap.priority);
        }
      }
    }
    return styleMap.classes || styleMap[themeName];
  }

  private _createStyleContainer(priority: number | null | undefined) {
    priority = priority ?? 0;
    const { styleContainers } = this.stylesInDocument;
    if (!styleContainers.has(priority)) {
      const el = this.core.renderer.createElement(`ly-s-c`);
      if (isDevMode()) {
        this.core.renderer.setAttribute(el, 'priority', `${priority}`);
      }
      styleContainers.set(priority, el);
      if (styleContainers.size === 0) {
        this.core.renderer.insertBefore(this._document.body, el, this._document.body.firstChild);
        return el as HTMLStyleElement;
      }
    } else {
      return styleContainers.get(priority)!;
    }
    const refChild = this.findNode(priority);
    this.core.renderer.insertBefore(this._document.body, styleContainers.get(priority), refChild);
    return styleContainers.get(priority)!;
  }

  private findNode(index: number) {
    const { styleContainers } = this.stylesInDocument;
    const keys = (Array.from(styleContainers.keys())).sort();
    const key = keys.find(_ => index < _);
    return (key !== undefined && styleContainers.get(key)) || this.core.firstElement;
  }

  private _createStyleElement() {
    const styleElement = this._document.createElement('style');
    return styleElement;
  }

  private _renderCss(styleElement: HTMLStyleElement, css: string, priority: number | undefined | null) {
    const container = this._createStyleContainer(priority);
    styleElement.appendChild(this._document.createTextNode(css));
    container.appendChild(styleElement);
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

function createLylStyle(
  styleMap: StyleMap5,
  styles: StyleTemplate,
  themeName: string,
  classNamePrefix?: string
) {

  // use current class or set new
  let className: string;
  className = styleMap[themeName]
    || (
      styleMap[themeName] = isDevMode()
        ? styleMap.id
          ? `${toValidClassName(styleMap.id!)}-${createNextClassId(classNamePrefix)}`
          : `${(styleMap.styles as Function).name || 'ii'}-${createNextClassId(classNamePrefix)}`
        : createNextClassId(classNamePrefix)
    );

  return styles(`.${className}`);
}

function groupStyleToString(
  styleMap: StyleMap5,
  styles: StyleGroup,
  themeName: string,
  id: string | null,
  typeStyle: TypeStyle,
  themeVariables: ThemeVariables,
  classNamePrefix?: string
) {

  // for styles type string
  if (typeStyle === TypeStyle.OnlyOne) {
    // use current class or set new
    const className = styleMap.requireUpdate
    ? styleMap[themeName] || (styleMap[themeName] = createNextClassId(classNamePrefix))
    : styleMap.classes
      ? styleMap.classes
      : styleMap.classes = createNextClassId(classNamePrefix);
    let rules: string;
    if (typeof styles === 'string') {
      rules = `.${className}{${styles}}`;
    } else {
      rules = styleToString(id, null, styles as StyleContainer, themeVariables, className as any);
    }
    if (styleMap.parentStyle) {
      const styleMapOfParentStyle = _STYLE_MAP.get(styleMap.parentStyle);
      if (!styleMapOfParentStyle) {
        throw new Error(`The parentStyle not exist or is called before being created.`);
      }
      return replaceRefs(rules, styleMapOfParentStyle[themeName]);
    }
    return rules;
  }

  // for multiples styles
  const themeNameForSelectors = getThemeNameForSelectors(themeName);
  const classesMap = styleMap[themeName] || (styleMap[themeName] = {});
  const selectorsMap = styleMap[themeNameForSelectors] || (styleMap[themeNameForSelectors] = {});
  const styleGroup = styles as StyleGroup;
  let content = '';
  const name = styleGroup.$name ? `${styleGroup.$name}-` : '';

  // set priority
  if (styleGroup.$priority != null) {
    styleMap.priority = styleGroup.$priority;
  }

  if (!styleMap.keys) {
    styleMap.keys = Object.keys(styles);
  }

  const keys = styleMap.keys;

  /** This loop creates the classes if necessary */
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const value = styles[key];
    if (key === '$global' || key === '$keyframes') {
      continue;
    }

    if (typeof value === 'function') {
      // lyl
      // set new id if not exist
      if (!(key in classesMap)) {
        classesMap[key] = isDevMode()
          ? `${toValidClassName(name + key)}-${createNextClassId(classNamePrefix)}`
          : createNextClassId(classNamePrefix);
      }

    } else if (typeof value === 'object' || value === null) {
      // set new id if not exist
      if (!(key in classesMap)) {
        classesMap[key] = isDevMode()
        ? toValidClassName(`y-${name}${key}-${createNextClassId(classNamePrefix)}`)
        : createNextClassId(classNamePrefix);
      }

    } else {
      continue;
    }

    if (!(key in selectorsMap)) {
      selectorsMap[key] = `.${classesMap[key]}`;
    }

  }
  let requireReplaceRefs = false;

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const value = styles[key];
    if (typeof value === 'function') {
      // lyl
      if (key === '$global') {
        if (value.length) {
          content += value(``);
        } else {
          content += (value as (() => StyleTemplate))()(``);
        }
      } else {
        const selector = selectorsMap[key];
        if (value.length) {
          content += value(selector);
        } else {
          const st = (value as (() => StyleTemplate | null))();
          if (st) {
            content += st(selector);
          }
        }
      }

    } else if (key === '$keyframes') {
      console.warn(`'$keyframes' is deprecated, use '$global' instead to create keyframes.`);
      requireReplaceRefs = true;
      content += keyframesToString(name, classesMap, value as KeyframesDeprecated, themeVariables);
    } else if (typeof value === 'object' && value !== null) {
      requireReplaceRefs = true;
      const currentClassName = classesMap[key];
      const style = styleToString(key, styleGroup.$name, value as StyleContainer, themeVariables, currentClassName);
      content += style;
      if (value === null) {
        console.warn(`__`, {style});
      }
    } // ignore if value === null
  }

  if (requireReplaceRefs) {
    return replaceRefs(content, classesMap);
  }
  return content;

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
function styleToString(
  key: string | null,
  $name: string | null | undefined,
  ob: StyleContainer,
  themeVariables: ThemeVariables,
  currentKey: string,
  parentKey?: string
) {

  let content = '';
  let subContent = '';
  let keyAndValue = '';
  let newKey: string;
  if (parentKey) {
    if (currentKey.indexOf('&') !== -1) {
      newKey = currentKey.replace(/&/g, parentKey);
    } else if (currentKey.indexOf('@media') === 0) {
      newKey = `${currentKey}`;
    } else if (currentKey === '@global' || parentKey === '@global') {
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
          subContent += styleToString(key, $name, element as StyleContainer, themeVariables, styleKey, newKey);
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

function keyframesToString(styleName: string, keysMap: object, keyframes: KeyframesDeprecated, themeVariables: ThemeVariables) {
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
      : keysMap[newUniqueName] = isDevMode() ? toValidClassName(`${styleName}${name}-${createNextKeyframeId()}-v`) : createNextKeyframeId();
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

function toValidClassName(str: string) {
  const s = str.replace(/^[0-9]|[^\w\-]/g, _ => {
    return `_${_.charCodeAt(0)}`;
  });
  return s;
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

function createNextClassId(classNamePrefix?: string) {
  return classNamePrefix
    ? `${classNamePrefix}${yClassID.next()}`
    : yClassID.next();
}
function createNextKeyframeId() {
  return `k${(nextKeyFrameId++).toString(36)}`;
}

export interface ThemeRef extends Pick<LyTheme2, 'selectorsOf' | 'renderStyleSheet'> { }
