import { Injectable, ElementRef, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from './platform';
import { StyleData, DataStyle } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class LyRootService {
  /** Style Container */
  rootContainer: HTMLElement;
  renderer: Renderer2;
  themeRootMap = new Map<string, StyleData>();
  private themeMap = new Map<string, Map<string, StyleData>>();
  private themes = new Map<string, {[key: string]: any}>();
  private _styleMap = new Map<string, DataStyle>();
  constructor(
    @Inject(DOCUMENT) _document: any,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    let container: any;
    if (Platform.isBrowser && (container = _document.querySelector('ly-core-theme'))) {
      this.rootContainer = container;
      // this._setUpStylesIfExist();
    } else {
      this.rootContainer = this.renderer.createElement('ly-core-theme');
      this.renderer.insertBefore(_document.body, this.rootContainer, _document.body.firstElementChild);
    }

    // setTimeout(() => this._setUpStylesIfExist(), 10000);
  }
  registerTheme(palette: any) {
    if (!this.themeMap.has(palette.name)) {
      this.themeMap.set(palette.name, new Map());
      this.themes.set(palette.name, palette);
    }
    return {
      map: this.themeMap.get(palette.name),
      palette: this.themes.get(palette.name)
    };
  }

  getTheme(name: string) {
    return this.themes.get(name);
  }

  // private _setUpStylesIfExist() {
  //   console.time('init');
  //   const list = this.rootContainer.childNodes;
  //   let index = 0;
  //   let styleElement: HTMLStyleElement;
  //   while (styleElement = list[index] as HTMLStyleElement) {
  //     const attribute = styleElement.attributes.item(0);
  //     const name = attribute.name;
  //     const id = attribute.value;
  //     this._styleMap.set(name, {
  //       id,
  //       styleElement
  //     });
  //     index++;
  //   }
  //   console.timeEnd('init');
  //   console.log(this._styleMap);
  // }

}
