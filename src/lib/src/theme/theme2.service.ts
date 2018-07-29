import { Injectable, Renderer2, Inject, Optional } from '@angular/core';
import { ThemeConfig, LY_THEME_NAME } from './theme-config';
import { CoreTheme } from './core-theme.service';
import { DataStyle, Style } from '../theme.service';
import { LyThemeContainer } from './theme.directive';
import { InvertMediaQuery } from '../media/invert-media-query';

@Injectable()
export class LyTheme2 {
  config: ThemeConfig;
  _styleMap: Map<string, DataStyle>;

  constructor(
    public core: CoreTheme,
    @Optional() @Inject(LY_THEME_NAME) themeName
  ) {
    console.log(`new Theme: ${themeName}`);
    if (themeName) {
      this.setUpTheme(themeName);
    }
  }
  setUpTheme(themeName: string) {
    if (!this.config) {
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
  colorOf(value: string): string {
    return get(this.config, value);
  }
  updateClassName(element: any, renderer: Renderer2, newClassname: string, oldClassname?: string) {
    this.core.updateClassName(element, renderer, newClassname, oldClassname);
  }
  setTheme(nam: string) {
    this.config = this.core.get(nam);
    this._styleMap.forEach((dataStyle, key) => {
      console.log(key);
      dataStyle.styleElement.innerText = this.core._createStyleContent(this.config, dataStyle.style, dataStyle.id);
    });
  }
}

function get(obj: Object, path: any): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    obj = obj[_path[i]] || path;
  }
  return typeof obj === 'string' ? obj as string : obj['default'] as string;
}
