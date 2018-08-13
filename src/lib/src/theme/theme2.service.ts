import { Injectable, Renderer2, Inject, Optional } from '@angular/core';
import { ThemeConfig, LY_THEME_NAME } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle, Style } from '../theme.service';
import { LyThemeContainer } from './theme.directive';
import { InvertMediaQuery } from '../media/invert-media-query';

export interface StyleItem {
  id: string;
  el: any;
  styles: StylesFn2<any> | Styles2;
}

const STYLE_MAP: {
  [key: string]: Map<string, StyleItem>
} = {};
const CLASSES_MAP: {
  [key: string]: string
} = {};
let nextId = 0;
@Injectable()
export class LyTheme2 {
  config: ThemeConfig;
  _styleMap: Map<string, DataStyle>;
  prefix = 'k';
  private _styleMap2: Map<string, StyleItem>;

  get classes() {
    return CLASSES_MAP;
  }

  constructor(
    public core: CoreTheme,
    @Optional() @Inject(LY_THEME_NAME) themeName
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
    const newClass = this.setUpStyle<T>(id, style);
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
    this.config = this.core.get(nam);
    this._styleMap2.forEach(dataStyle => {
      dataStyle.el.innerText = this._createStyleContent2(dataStyle.styles, dataStyle.id).content;
    });
    this._styleMap.forEach((dataStyle) => {
      dataStyle.styleElement.innerText = this.core._createStyleContent(this.config, dataStyle.style, dataStyle.id);
    });
  }
  /**
   * Add new add a new style sheet
   * @param styles styles
   * @param id unique id for group
   */
  addStyleSheet<T>(styles: StylesFn2<T> | Styles2, id?: string) {
    const newId = id || '';
    const styleContent = this._createStyleContent2(styles, newId);
    const styleText = this.core.renderer.createText(styleContent.content);
    const styleElement = this.core.renderer.createElement('style');
    this.core.renderer.appendChild(styleElement, styleText);
    this.core.renderer.appendChild(this.core.primaryStyleContainer, styleElement);
    this._styleMap2.set(styleContent.key, {
      id: newId,
      el: styleElement,
      styles
    });
  }

  _createStyleContent2<T>(styles: StylesFn2<T> | Styles2, id: string) {
    if (typeof styles === 'function') {
      return groupStyleToString(styles(this.config), id);
    } else {
      return groupStyleToString(styles, id);
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

function groupStyleToString(styles: Styles2, id: string) {
  let content = '';
  let newKey = '';
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      newKey += key;
      // if (styleMap.has(key)) {
      //   content += styleMap.get(key);
      // } else {
        const value = styles[key];
        if (typeof value === 'object') {
          const classId = id + capitalizeFirstLetter(key);
          const className = classId in CLASSES_MAP
          ? CLASSES_MAP[classId]
          : CLASSES_MAP[classId] = `e${nextId++}`;
          const style = styleToString(value as Styles2, `.${className}`);
          // styleMap.set((key), style);
          content += style;
        } else {
          console.log('value is string', value);
        }
      // }
    }
  }
  return {
    key: id + newKey,
    content
  };
}

/**
 * {color:'red'} to .className{color: red}
 */
function styleToString(ob: Object, className: string, parentClassName?: string) {
  let content = '';
  let keyAndValue = '';
  for (const styleKey in ob) {
    if (ob.hasOwnProperty(styleKey)) {
      const element = ob[styleKey];
      if (typeof element === 'object') {
        content += styleToString(element as Styles2, styleKey, className);
      } else {
        keyAndValue += `${styleKey}:${element};`;
      }
    }
  }
  let newClassName = '';
  if (parentClassName) {
    newClassName += className.indexOf('&') === 0 ? `${parentClassName}${className.slice(1)}` : `${parentClassName} .${className}`;
  } else {
    newClassName += className;
  }
  content += `${newClassName}{${keyAndValue}}`;
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

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

@Injectable({
  providedIn: 'root'
})
export class LyClasses {
  get classes() {
    return CLASSES_MAP;
  }
}
