import { Injectable, Optional, Inject, Renderer2, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { ThemeConfig, LY_THEME_CONFIG, LyThemeConfig } from './theme-config';
import { DOCUMENT } from '@angular/common';
import { DataStyle } from '../theme.service';
import { Platform } from '../platform';

@Injectable({
  providedIn: 'root'
})
export class CoreTheme {
  renderer: Renderer2;
  mediaStyleContainer: HTMLElement;
  primaryStyleContainer: HTMLElement;
  secondaryStyleContainer: HTMLElement;
  firstElement: HTMLElement;
  readonly themes = new Set<string>();
  private _themeMap = new Map<string, ThemeConfig>();
  private _styleMap = new Map<string, Map<string, DataStyle>>();
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
    if (themeConfig) {
      themeConfig.themes.forEach(item => {
        const newTheme = new item;
        this.add(newTheme);
        this.themes.add(newTheme.name);
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

  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    if (oldClassname) {
      renderer.removeClass(element, oldClassname);
    }
    renderer.addClass(element, newClassname);
  }

}
