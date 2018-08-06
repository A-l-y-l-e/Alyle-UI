import { Directive, Injectable, Optional, NgModule, SkipSelf } from '@angular/core';
import { Platform } from '../platform/index';

@Injectable()
export class LyOverlayContainer {
  protected _containerElement: HTMLElement;
  constructor() {
    if (Platform.isBrowser) {
      const container = document.createElement('ly-overlay-container');
      document.body.appendChild(container);
      this._containerElement = container;
    }
  }
  get containerElement(): HTMLElement {
    return this._containerElement;
  }
}

