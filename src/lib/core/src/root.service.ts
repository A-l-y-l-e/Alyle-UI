import { Injectable, ElementRef, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from './platform';
import { StyleData } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class LyRootService {
  rootContainer: ElementRef;
  renderer: Renderer2;
  themeRootMap = new Map<string, StyleData>();
  private themeMap = new Map<string, Map<string, StyleData>>();
  private themes = new Map<string, {[key: string]: any}>();
  constructor(
    @Inject(DOCUMENT) _document,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    let container: any;
    if (Platform.isBrowser && (container = window.document.querySelector('ly-core-theme'))) {
      this.rootContainer = container;
    } else {
      this.rootContainer = this.renderer.createElement('ly-core-theme');
      this.renderer.insertBefore(_document.body, this.rootContainer, _document.body.firstElementChild);
    }
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

}
