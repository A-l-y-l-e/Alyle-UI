import { Injectable, Renderer2 } from '@angular/core';
import { ThemeConfig } from './theme-config';
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
  ) {}
  setUpStyle(
    key: string,
    styles: Style,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    const name = this.config.name;
    return this.core._ĸreateStyle(key, styles, this._styleMap, name, this.core.primaryStyleContainer, media, invertMediaQuery);
  }
  setUpStyleSecondary(
    key: string,
    styles: Style,
    media?: string,
    invertMediaQuery?: InvertMediaQuery
  ) {
    const name = this.config.name;
    return this.core._ĸreateStyle(key, styles, this._styleMap, name, this.core.secondaryStyleContainer, media, invertMediaQuery);
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
      dataStyle.styleElement.innerText = this.core._createStyleContent(dataStyle.style, dataStyle.id);
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
