import { ComponentRef, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface OverlayReference {
  /** Stream of keydown events dispatched to this overlay. */
  readonly _keydownEvents: Subject<KeyboardEvent>;

  /** Function that will be called on scroll or resize event */
  onResizeScroll: (() => void) | null;

  get injector(): Injector | undefined;

  get containerElement(): HTMLDivElement;
  get backdropElement(): Element | null;
  get componentRef(): ComponentRef<any> | null;
  get isDestroyed(): boolean;

  updateBackdrop: (hasBackdrop: boolean) => void;

  /** Gets an observable of keydown events targeted to this overlay. */
  keydownEvents(): Observable<KeyboardEvent>;

  /** Detaches a view from dirty checking again of ApplicationRef. */
  detach: () => void;

  /** Remove element of DOM */
  remove: () => void;

  /** Detach & remove */
  destroy: () => void;
}
