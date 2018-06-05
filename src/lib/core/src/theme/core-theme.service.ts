import { Injectable, Optional, Inject, Renderer2, RendererFactory2, isDevMode } from '@angular/core';
import { THEME_CONFIG, ThemeConfig, THEME_CONFIG_EXTRA, LY_THEME_CONFIG, LyThemeConfig } from './theme-config';
import { DOCUMENT } from '@angular/common';
import { StyleContent, StyleData, DataStyle, MultipleStyles, mergeDeep } from '../theme.service';

let classId = 0;

@Injectable({
  providedIn: 'root'
})
export class CoreTheme {
  renderer: Renderer2;
  primaryStyleContainer: HTMLElement;
  secondaryStyleContainer: HTMLElement;
  private _themeMap = new Map<string, ThemeConfig>();
  private _styleMap = new Map<string, Map<string, DataStyle>>();
  private _styleCoreMap = new Map<string, DataStyle>();
  constructor(
    @Optional() @Inject(THEME_CONFIG) configs: ThemeConfig | ThemeConfig[],
    @Optional() @Inject(THEME_CONFIG_EXTRA) themeExtra: any,
    @Optional() @Inject(LY_THEME_CONFIG) themeConfig: LyThemeConfig,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private _document: any,
  ) {
    if (!themeConfig) {
      throw new Error('LY_THEME_CONFIG undefined');
    }
    // if (themeExtra) {
    //   themeConfig = mergeDeep(configs, themeExtra);
    // } else {
    //   themeConfig = configs;
    // }
    this.renderer = this.rendererFactory.createRenderer(null, null);
    // let container: any;
    // if (Platform.isBrowser && (container = _document.querySelector('ly-core-theme'))) {
      // this.rootContainer = container;
    // } else {
      this.primaryStyleContainer = this.renderer.createElement('ly-primary-style-container');
      this.secondaryStyleContainer = this.renderer.createElement('ly-secondary-style-container');
      this.renderer.insertBefore(_document.body, this.primaryStyleContainer, _document.body.firstElementChild);
      this.renderer.insertBefore(_document.body, this.secondaryStyleContainer, this.primaryStyleContainer);
    // }
    this.setCoreStyle();
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
    styles: MultipleStyles,
    _in?: any
  ) {
    return this._ĸreateStyle(key, styles, this._styleCoreMap, 'root', _in);
  }
  setUpStyleSecondary(
    key: string,
    styles: MultipleStyles
  ) {
    return this._ĸreateStyle(key, styles, this._styleCoreMap, 'root', this.secondaryStyleContainer);
  }

  _ĸreateStyle(key, style: MultipleStyles, mapStyles: Map<string, DataStyle>, _for: string, _in?: any) {
    if (mapStyles.has(key)) {
      return mapStyles.get(key).id;
    } else {
      const id = `k${(classId++).toString(36)}`;
      const styleElement = this.renderer.createElement('style');
      const styleContent = this.renderer.createText(this._createStyleContent(style, id));
      this.renderer.appendChild(styleElement, styleContent);
      this.renderer.appendChild(_in || this.primaryStyleContainer, styleElement);
      if (isDevMode()) {
        this.renderer.setAttribute(styleElement, 'key', `${id}···${key}`, _for);
      }
      const dataStyle = {
        id,
        style,
        styleElement
      };
      mapStyles.set(key, dataStyle);
      return id;
    }
  }

  /** #style */
  _createStyleContent(styles: MultipleStyles, id: string) {
    let content = '';
    // tslint:disable-next-line:forin
    for (const key$ in styles) {
      const fn = styles[key$];
      content += `.${id}${key$}{${fn()}}`;
    }
    return content;
  }

  private setCoreStyle() {
    const classname = this.setUpStyle('rootbody', {
      '': () => (
        `margin:0;`
      )
    });
    this.renderer.addClass(this._document.body, classname);
  }

  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    if (oldClassname) {
      renderer.removeClass(element, oldClassname);
    }
    renderer.addClass(element, newClassname);
  }

}

