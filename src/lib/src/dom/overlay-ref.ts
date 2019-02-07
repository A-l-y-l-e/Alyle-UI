import { ComponentRef } from '@angular/core';

// @Injectable()
export class LyOverlayRef<T = any> {
  containerElement: HTMLDivElement;
  componentRef: ComponentRef<T> | null;

  /** Function that will be called on scroll or resize event */
  onResizeScroll: (() => void) | null;

  /** Detaches a view from dirty checking again of ApplicationRef. */
  readonly detach: () => void;

  /** Remove element of DOM */
  remove: () => void;

  /** Detach & remove */
  destroy: () => void;
}
