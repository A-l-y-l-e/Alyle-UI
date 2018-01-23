import { Directive, Injectable, Optional, NgModule, SkipSelf } from '@angular/core';

@Injectable()
export class LyOverlayContainer {
  protected _containerElement: HTMLElement;
  constructor() {
    try {
      const container = document.createElement('ly-overlay-container');
      document.body.appendChild(container);
      this._containerElement = container;
    } catch (error) {
      // nothing
    }
  }
  get containerElement(): HTMLElement {
    return this._containerElement;
  }
}

export function LY_OVERLAY_CONTAINER_PROVIDER_FACTORY(parentContainer: LyOverlayContainer) {
  return parentContainer || new LyOverlayContainer();
}

export const LY_OVERLAY_CONTAINER_PROVIDER = {
  // If there is already an OverlayContainer available, use that. Otherwise, provide a new one.
  provide: LyOverlayContainer,
  deps: [[new Optional(), new SkipSelf(), LyOverlayContainer]],
  useFactory: LY_OVERLAY_CONTAINER_PROVIDER_FACTORY
};
