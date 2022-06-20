import { Inject, Injectable, NgZone } from '@angular/core';
import { LyTheme2 } from '../theme/theme2.service';
import { ThemeVariables } from '../theme/theme-config';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { OverlayReference } from './overlay-reference';
import { lyl } from '../parse';

const styles = (theme: ThemeVariables) => {
  return {
    overlay: lyl `{
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      z-index: ${theme.zIndex.overlay}
      pointer-events: none
    }`
  };
};

@Injectable({
  providedIn: 'root'
})
export class LyOverlayContainer {
  private _classes = this.theme.addStyleSheet(styles);
  protected readonly _containerElement: HTMLElement;
  private _items = new Set<any>();
  private _overlays = new Set<OverlayReference>();
  protected _document: Document;
  protected _isAttached: boolean;
  get overlayLen() {
    return this._items.size;
  }
  private _isActiveOverlayContainer: boolean;
  constructor(
    private theme: LyTheme2,
    private _platform: Platform,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) document: any,
  ) {
    this._document = document;
    if (this._platform.isBrowser) {
      const container = document.createElement('ly-overlay-container');
      document.body.appendChild(container);
      this._containerElement = container;
    }
  }
  get containerElement(): HTMLElement {
    return this._containerElement;
  }

  addOverlay(overlayRef: OverlayReference) {
    this._overlays.add(overlayRef);
    if (!this._isAttached) {
      this._ngZone.runOutsideAngular(() =>
        this._document.body.addEventListener('keydown', this._keydownListener),
      );
      this._isAttached = true;
    }
  }

  removeOverlay(overlayRef: OverlayReference) {
    this._overlays.delete(overlayRef);
    if (!this._overlays.size && this._isAttached) {
      this._document.body.removeEventListener('keydown', this._keydownListener);
      this._isAttached = false;
    }
  }

  /**
   * Add instance
   * @ignore
   */
  _addElement(item: Element) {
    this._items.add(item);
    this.containerElement.appendChild(item);
    this._update();
  }

    /**
   * Remove instance
   * @ignore
   */
  _removeElement(item: Element) {
    this.containerElement.removeChild(item);
    this._items.delete(item);
    this._update();
  }

  /**
   * Update styles for overlay container
   * @ignore
   */
  private _update() {
    if (this._items.size) {
      if (!this._isActiveOverlayContainer) {
        this._isActiveOverlayContainer = true;
        this._containerElement.classList.add(this._classes.overlay);
      }
    } else if (this._isActiveOverlayContainer) {
      this._containerElement.classList.remove(this._classes.overlay);
      this._isActiveOverlayContainer = false;
    }
  }

  /** Keyboard event listener that will be attached to the body. */
  private _keydownListener = (event: KeyboardEvent) => {
    const overlays = Array.from(this._overlays);

    for (let i = overlays.length - 1; i > -1; i--) {
      const observed = overlays[i]._keydownEvents.observers.length > 0;
      if (observed) {
        const keydownEvents = overlays[i]._keydownEvents;
        this._ngZone.run(() => keydownEvents.next(event));
        break;
      }
    }
  }
}
