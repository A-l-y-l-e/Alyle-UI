import { ElementRef, NgZone, Injectable, OnDestroy } from '@angular/core';
import { supportsPassiveEventListeners } from '../platform/index';
import { Observable, Subject } from 'rxjs';
import { getNativeElement } from '../minimal/common';
import { Platform } from '@angular/cdk/platform';

export enum FocusStatus {
  /**mouse and/or touch*/
  DEFAULT = 'default',
  /** keyboard and/or program*/
  KEYBOARD = 'keyboard',
}

export interface FocusStateInfo {
  unlisten: () => void;
  subject: Subject<FocusState>;
}

export type FocusState = 'keyboard' | 'mouse' | null;

@Injectable({
  providedIn: 'root'
})
export class LyFocusState implements OnDestroy {
  private _elementMap = new Map<HTMLElement, FocusStateInfo>();
  private _currentEvent: FocusState;
  private _removeGlobalListeners: () => void;
  private _count = 0;

  constructor(
    private _ngZone: NgZone,
    private _platform: Platform
  ) { }

  listen(element: HTMLElement | ElementRef<HTMLElement>, keyElement?: HTMLElement | ElementRef<HTMLElement>): Observable<FocusState> | null {
    if (!this._platform.isBrowser) {
      // return null if it is not browser platform
      return null;
    }

    const nativeElement = getNativeElement(element);
    const key = keyElement && getNativeElement(keyElement) || nativeElement;

    if (this._elementMap.has(key)) {
      return this._elementMap.get(key)!.subject.asObservable();
    }

    const focusState: FocusStateInfo = {
      unlisten: null as any,
      subject: new Subject<FocusState>()
    };
    this._incrementCount();
    const focusListener = (event: FocusEvent) => this._on(event, focusState.subject);
    const blurListener = (event: FocusEvent) => this._on(event, focusState.subject);

    focusState.unlisten = () => {
      nativeElement.removeEventListener('focus', focusListener, true);
      nativeElement.removeEventListener('blur', blurListener, true);
    };

    this._elementMap.set(key, focusState);

    this._ngZone.runOutsideAngular(() => {
      nativeElement.addEventListener('focus', focusListener, true);
      nativeElement.addEventListener('blur', blurListener, true);
    });
    return focusState.subject.asObservable();
  }

  focusElement(element: HTMLElement | ElementRef<HTMLElement>, origin: FocusState, options: FocusOptions) {
    const nativeElement = getNativeElement(element);

    this._currentEvent = origin;

    if (typeof nativeElement.focus === 'function') {
      nativeElement.focus(options);
    }
  }

  unlisten(element: HTMLElement | ElementRef<HTMLElement>) {
    if (!this._platform.isBrowser) {
      return;
    }
    const el = getNativeElement(element);
    const focusStateInfo = this._elementMap.get(el);
    if (focusStateInfo) {
      focusStateInfo.unlisten();
      this._elementMap.delete(el);
      this._decrementCount();
    }
  }

  private _on(event: FocusEvent, subject: Subject<FocusState>) {
    let by: FocusState = null;
    if (event.type === 'focus') {
      by = this._currentEvent || 'keyboard';
    }
    this._ngZone.run(() => subject.next(by));
  }

  private _addGlobalListeners() {
    if (!this._platform.isBrowser) {
      return;
    }

    const eventListenerOptions = supportsPassiveEventListeners()
    ? {
      passive: true,
      capture: true
    } : false;

    const documentKeydownListener = () => this._ngZone.runOutsideAngular(() => this._currentEvent = 'keyboard');
    const documentMousedownListener = () => this._ngZone.runOutsideAngular(() => this._currentEvent = 'mouse');

    this._ngZone.runOutsideAngular(() => {
      document.addEventListener('keydown', documentKeydownListener, eventListenerOptions);
      document.addEventListener('mousedown', documentMousedownListener, eventListenerOptions);
    });
    this._removeGlobalListeners = () => {
      document.removeEventListener('keydown', documentKeydownListener, eventListenerOptions);
      document.removeEventListener('mousedown', documentMousedownListener, eventListenerOptions);
    };
  }

  private _incrementCount() {
    if (++this._count === 1) {
      this._addGlobalListeners();
    }
  }

  private _decrementCount() {
    if (!--this._count) {
      this._removeGlobalListeners();
    }
  }

  ngOnDestroy() {
    this._elementMap.forEach((_, element) => this.unlisten(element));
  }
}
