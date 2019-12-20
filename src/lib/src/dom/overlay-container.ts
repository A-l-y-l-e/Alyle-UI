import { Injectable } from '@angular/core';
import { Platform } from '../platform/index';
import { LyTheme2 } from '../theme/theme2.service';
import { ThemeVariables } from '../theme/theme-config';

const styles = (theme: ThemeVariables) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.overlay,
    pointerEvents: 'none'
  }
});

@Injectable({
  providedIn: 'root'
})
export class LyOverlayContainer {
  private _classes = this.theme.addStyleSheet(styles);
  protected readonly _containerElement: HTMLElement;
  private _items = new Set<any>();
  get overlayLen() {
    return this._items.size;
  }
  private _isActiveOverlayContainer: boolean;
  constructor(
    private theme: LyTheme2
  ) {
    if (Platform.isBrowser) {
      const container = document.createElement('ly-overlay-container');
      document.body.appendChild(container);
      this._containerElement = container;
    }
  }
  get containerElement(): HTMLElement {
    return this._containerElement;
  }

  /**
   * Add instance
   * @ignore
   */
  _add(item) {
    this._items.add(item);
    this.containerElement.insertBefore(item, this.containerElement.firstChild);
    this._update();
  }

    /**
   * Remove instance
   * @ignore
   */
  _remove(item) {
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
}
