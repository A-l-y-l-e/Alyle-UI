import { Directive, ElementRef, ChangeDetectorRef, NgZone, Renderer2, OnDestroy, EventEmitter, Output, Injectable } from '@angular/core';
import { Platform, supportsPassiveEventListeners } from '../platform/index';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getNativeElement } from '../minimal/common';

export enum FocusStatus {
  /**mouse and/or touch*/
  DEFAULT = 'default',
  /** keyboard and/or program*/
  KEYBOARD = 'keyboard',
}

@Directive({
  selector: '[lyFocusState]',
  exportAs: 'lyFocusState'
})
export class LyFocusStateDeprecated implements OnDestroy {
  state: FocusStatus;
  stateMap = new Map<string, boolean>();
  private _containerElement: Element;
  private _eventHandlers = new Map<string, (e: Event) => void>();
  private _stateSubject = new Subject<FocusStatus>();
  _stateSubscription: Subscription;
  @Output() lyFocusChange = new EventEmitter<FocusStatus>();
  private _eventOptions = {passive: true} as any;
  constructor(
    elementRef: ElementRef,
    private _ngZone: NgZone,
    private _renderer: Renderer2,
    _cd: ChangeDetectorRef
  ) {
    if (Platform.isBrowser) {
      this._eventHandlers
      .set('focus', this.on.bind(this))
      .set('blur', this.on.bind(this))
      .set('touchstart', this.on.bind(this))
      .set('mousedown', this.on.bind(this));
      const element = elementRef.nativeElement;
      this.setTriggerElement(element);
      const on = (event: FocusEvent | TouchEvent | MouseEvent) => {
        this.stateMap.set(event.type, true);
        this._updateState();
      };
      const ob: Observable<FocusStatus> = this._stateSubject.asObservable();
      this._stateSubscription = ob
      // .debounceTime(111)
      .pipe(
        debounceTime(111)
      )
      .subscribe((e: FocusStatus) => {
        this.state = e;
        this._updateClass();
        this.lyFocusChange.emit(e);
      });
    }
  }

  private _updateState() {
    let state;
    if (this.stateMap.has('blur')) {
      this.stateMap.clear();
    } else if (this.stateMap.has('focus') && this.stateMap.has('mousedown') || this.stateMap.has('focus') && this.stateMap.has('touchstart')) {
      state = FocusStatus.DEFAULT;
    } else if (this.stateMap.has('focus')) {
      state = FocusStatus.KEYBOARD;
    }
    this._stateSubject.next(state);
  }

  on(event: FocusEvent | TouchEvent | MouseEvent) {
    this.stateMap.set(event.type, true);
    this._updateState();
  }

  private _updateClass() {
    const element = this._containerElement;
    const state = this.state;
    const toggleClass = (className: string, shouldSet: boolean) => shouldSet ? this._renderer.addClass(element, className) : this._renderer.removeClass(element, className);
    toggleClass(`ly-focused`, !!state);
    for (const key in FocusStatus) {
      if (FocusStatus.hasOwnProperty(key)) {
        const className = FocusStatus[key];
        toggleClass(`ly-${className}-focused`, state === className);
      }
    }
  }

  setTriggerElement(element: HTMLElement | null) {
    if (this._containerElement) {
      this._eventHandlers.forEach((fn, type) => {
        this._containerElement.removeEventListener(type, fn, this._eventOptions);
      });
    }
    if (element) {
      this._ngZone.runOutsideAngular(() => {
        return this._eventHandlers.forEach((fn, type) => {
          return element.addEventListener(type, fn, this._eventOptions);
        });
      });
    }
    this._containerElement = element;
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      this._stateSubscription.unsubscribe();
      this.setTriggerElement(null);
    }
  }
}

export interface FocusStateInfo {
  unlisten: () => void;
  subject: Subject<FocusState>;
}

export interface FocusState {
  event: FocusEvent;
  by: 'keyboard' | 'mouse';
}

@Injectable({
  providedIn: 'root'
})
export class LyFocusState implements OnDestroy {
  private _elementMap = new Map<HTMLElement, FocusStateInfo>();
  private _currentEvent: 'mouse' | 'keyboard';
  private _removeGlobalListeners: () => void;
  private _count = 0;

  constructor(
    private _ngZone: NgZone
  ) { }

  listen(element: HTMLElement | ElementRef<HTMLElement>, keyElement?: HTMLElement | ElementRef<HTMLElement>): Observable<FocusState> | null {
    if (!Platform.isBrowser) {
      // return null if it is not browser platform
      return null;
    }

    const nativeElement = getNativeElement(element);
    const key = keyElement && getNativeElement(keyElement) || nativeElement;

    if (this._elementMap.has(key)) {
      return this._elementMap.get(key).subject.asObservable();
    }

    const focusState: FocusStateInfo = {
      unlisten: null,
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

  unlisten(element: HTMLElement | ElementRef<HTMLElement>) {
    const focusStateInfo = this._elementMap.get(getNativeElement(element));
    if (focusStateInfo) {
      focusStateInfo.unlisten();
      this._decrementCount();
    }
  }

  private _on(event: FocusEvent, subject: Subject<FocusState>) {
    this._ngZone.run(() => subject.next({
      event,
      by: this._currentEvent || 'keyboard'
    }));
  }

  private _addGlobalListeners() {
    if (!Platform.isBrowser) {
      return;
    }

    const eventListenerOptions = supportsPassiveEventListeners
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
