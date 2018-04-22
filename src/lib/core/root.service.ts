import { Injectable, ElementRef, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from './platform';

@Injectable({
  providedIn: 'root'
})
export class LyRootService {
  rootContainer: ElementRef;
  renderer: Renderer2;
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
}
