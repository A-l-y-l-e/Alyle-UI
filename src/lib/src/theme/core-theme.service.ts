import { Injectable, Optional, Inject, Renderer2, RendererFactory2, isDevMode, ViewEncapsulation } from '@angular/core';
import { ThemeConfig, LY_THEME_CONFIG, LyThemeConfig } from './theme-config';
import { DOCUMENT } from '@angular/common';
import { StyleContent, DataStyle, Style, MultipleStyles } from '../theme.service';
import { Platform } from '../platform';
import { InvertMediaQuery, transformMediaQuery } from '../media/invert-media-query';

let classId = 0;

@Injectable({
  providedIn: 'root'
})
export class CoreTheme {
  renderer: Renderer2;
  mediaStyleContainer: HTMLElement;
  primaryStyleContainer: HTMLElement;
  secondaryStyleContainer: HTMLElement;
  firstElement: HTMLElement;
  private _themeMap = new Map<string, ThemeConfig>();
  private _styleMap = new Map<string, Map<string, DataStyle>>();
  private _styleCoreMap = new Map<string, DataStyle>();
  constructor(
    @Optional() @Inject(LY_THEME_CONFIG) themeConfig: LyThemeConfig,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) _document: any,
  ) {
    if (!themeConfig) {
      throw new Error('LY_THEME_CONFIG undefined');
    }
    this.renderer = this.rendererFactory.createRenderer(null, {
      id: 'ly',
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {}
    });
    if (Platform.isBrowser) {
      const nodes: NodeList = _document.body.querySelectorAll('ly-s-c');
      if (nodes.length) {
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes.item(index);
          (_document.body as HTMLBodyElement).removeChild(element);
        }
      }
    }
    this.firstElement = _document.body.firstChild;
    // this.mediaStyleContainer = this.renderer.createElement('ly-media-style-container');
    // this.primaryStyleContainer = this.renderer.createElement('ly-primary-style-container');
    // this.secondaryStyleContainer = this.renderer.createElement('ly-secondary-style-container');
    // this.renderer.insertBefore(_document.body, this.mediaStyleContainer, _document.body.firstChild);
    // this.renderer.insertBefore(_document.body, this.primaryStyleContainer, this.mediaStyleContainer);
    // this.renderer.insertBefore(_document.body, this.secondaryStyleContainer, this.primaryStyleContainer);
    if (themeConfig) {
      themeConfig.themes.forEach(item => {
        this.add(new item);
      });
    }
  }

  /**
   * add new theme
   * @param theme: ThemeConfig
   */
  add(theme: ThemeConfig) {
    this._themeMap.set(theme.name, theme);
    this._styleMap.set(theme.name, new Map());
  }

  get(name: string) {
    return this._themeMap.get(name);
  }
  getStyleMap(name: string) {
    return this._styleMap.get(name);
  }

  setUpStyle(
    key: string,
    styles: Style<null>,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    return this._ĸreateStyle(undefined, key, styles, this._styleCoreMap, 'root', this.primaryStyleContainer, media, invertMediaQuery);
  }
  setUpStyleSecondary(
    key: string,
    styles: Style<null>,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    return this._ĸreateStyle(undefined, key, styles, this._styleCoreMap, 'root', this.secondaryStyleContainer, media, invertMediaQuery);
  }

  _ĸreateStyle<T>(themeConfig: any, key, style: Style<T>, mapStyles: Map<string, DataStyle>, _for: string, _in: any, _media?: string, invertMediaQuery?: InvertMediaQuery) {
    if (mapStyles.has(key)) {
      return mapStyles.get(key).id;
    } else {
      const id = `k${(classId++).toString(36)}`;
      const styleElement = this.renderer.createElement('style');
      const media = transformMediaQuery(_media, invertMediaQuery);
      const styleContent = this.renderer.createText(this._createStyleContent<T>(themeConfig, style, id, media));
      const saveIn = media ? this.mediaStyleContainer : _in;
      this.renderer.appendChild(styleElement, styleContent);
      this.renderer.appendChild(saveIn, styleElement);
      if (isDevMode()) {
        this.renderer.setAttribute(styleElement, 'style_data', `${_for}···${id}···${key}`);
      }
      const dataStyle = {
        id,
        style,
        styleElement,
        media
      };
      mapStyles.set(key, dataStyle);
      return id;
    }
  }

  /** #style */
  _createStyleContent<T>(themeConfig: T, styles: Style<T>, id: string, media?: string | string[]) {
    const typf = typeof styles;
    if (typf === 'string') {
      return toMedia(`.${id}{${styles}}`, media);
    } else if (typf === 'function') {
      return toMedia(`.${id}{${(styles as StyleContent<T>)(themeConfig)}}`, media);
    }
    let content = '';
    for (const key$ in styles as MultipleStyles<T>) {
      if (styles.hasOwnProperty(key$)) {
        const val = styles[key$];
        const text = typeof val === 'function' ? val(themeConfig) : val;
        content += `.${id}${key$}{${text}}`;
      }
    }
    return toMedia(content, media);
  }

  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    if (oldClassname) {
      renderer.removeClass(element, oldClassname);
    }
    renderer.addClass(element, newClassname);
  }

}

/**
 * Converter to media query if `media` is present
 * @param text style content
 * @param media media query
 */
function toMedia(text: string, media?: string | string[]) {
  if (typeof media === 'string') {
    return `@media ${media}{${text}}`;
  } else if (Array.isArray(media)) {
    let result = '';
    media.forEach(_ => result += `@media ${_}{${text}}`);
    return result;
  }
  return text;
}
