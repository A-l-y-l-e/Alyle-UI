import { Injectable, Optional, Inject, Renderer2, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { ThemeConfig, LY_THEME, ThemeVariables, LY_THEME_GLOBAL_VARIABLES } from './theme-config';
import { DOCUMENT } from '@angular/common';
import { DataStyle } from '../theme.service';
import { Platform } from '../platform';
import { mergeThemes } from '../parse';

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
  private _themeMap = new Map<string, ThemeVariables>();
  private _styleMap = new Map<string, Map<string, DataStyle>>();
  constructor(
    @Optional() @Inject(LY_THEME) themeConfig: ThemeConfig[] | ThemeConfig,
    @Optional() @Inject(LY_THEME_GLOBAL_VARIABLES) globalVariables: ThemeConfig,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) _document: any
  ) {
    if (!themeConfig) {
      throw new Error(
        `LY_THEME undefined: no theme has been added, please add at least one theme\n\n` +
        `Follow the steps of the documentation https://goo.gl/8V486A`
      );
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
          const element = nodes.item(index)!;
          (_document.body as HTMLBodyElement).removeChild(element);
        }
      }
    }
    this.firstElement = _document.body.firstChild;
    const themes = new Map<string, ThemeConfig[]>();
    if (Array.isArray(themeConfig)) {
      themeConfig.forEach(item => {
        if (themes.has(item.name)) {
          themes.get(item.name)!.push(item);
        } else {
          themes.set(item.name, [item]);
        }
      });

      themes.forEach((items) => {
        if (globalVariables) {
          items.push(globalVariables);
        }
        if (items.length > 1) {
          mergeThemes(items[0], ...items.slice(1));
        }
        this.add(items[0] as any);
        this.themes.add(items[0].name);
      });

    } else {
      if (globalVariables) {
        mergeThemes(themeConfig, globalVariables);
      }
      this.add(themeConfig as any);
      this.themes.add(themeConfig.name);
    }
  }

  /**
   * add new theme
   * @param theme: ThemeVariables
   */
  add(theme: ThemeVariables) {
    this._themeMap.set(theme.name, theme);
    this._styleMap.set(theme.name, new Map());
  }

  hasTheme(theme: ThemeVariables | string) {
    const name = typeof theme === 'string' ? theme : theme.name;
    this._themeMap.has(name);
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
