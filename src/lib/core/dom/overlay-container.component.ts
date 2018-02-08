import { Directive, Injectable, Optional, NgModule, SkipSelf } from '@angular/core';
import { Platform } from '../platform/index';

@Injectable()
export class LyOverlayContainer {
  protected _containerElement: HTMLElement;
  constructor() {
    if (Platform.isBrowser) {
      console.log('...create overlay');
      try {
        const container = document.createElement('ly-overlay-container');
        document.body.appendChild(container);
        this._containerElement = container;
      } catch (error) {
        // nothing
      }
    }
  }
  get containerElement(): HTMLElement {
    return this._containerElement;
  }
}

