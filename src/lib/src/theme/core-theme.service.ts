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
  private _document: Document;
  constructor(
    @Optional() @Inject(LY_THEME) themeConfig: ThemeConfig[] | ThemeConfig,
    @Optional() @Inject(LY_THEME_GLOBAL_VARIABLES) globalVariables: ThemeConfig,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) _document: any
  ) {
    this._document = _document;

    if (Platform.isBrowser) {
      // Clean
      const nodes: NodeList = this._document.body.querySelectorAll('ly-s-c');
      if (nodes.length) {
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes.item(index)!;
          (this._document.body as HTMLBodyElement).removeChild(element);
        }
      }
    }

    this.firstElement = this._document.body.firstChild! as HTMLElement;

    this.renderer = this.rendererFactory.createRenderer(null, {
      id: 'ly',
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {}
    });

    if (themeConfig) {
      this.initializeTheme(themeConfig, globalVariables);
    }
  }

  initializeTheme(themeConfig: ThemeConfig[] | ThemeConfig, globalVariables: ThemeConfig) {

    const allThemes = Array.isArray(themeConfig) ? themeConfig : [themeConfig];

    const themes = new Map<string, ThemeConfig[]>();

    allThemes.forEach(item => {
      // Do not install themes that are already initialized.
      if (this.hasTheme(item.name)) {
        throw new Error(`Theme '${item.name}' is already initialized.`);
      }
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
      console.log(items[0]);
      this._add(items[0] as any);
      this.themes.add(items[0].name);
    });
  }

  /**
   * add new theme
   * @param theme: ThemeVariables
   */
  private _add(theme: ThemeVariables) {
    this._themeMap.set(theme.name, theme);
    this._styleMap.set(theme.name, new Map());
  }

  hasTheme(theme: ThemeVariables | string) {
    const name = typeof theme === 'string' ? theme : theme.name;
    return this._themeMap.has(name);
  }

  get(name: string) {
    return this._themeMap.get(name);
  }

  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    if (oldClassname) {
      renderer.removeClass(element, oldClassname);
    }
    renderer.addClass(element, newClassname);
  }

}
