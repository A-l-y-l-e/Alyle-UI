import { Directive, ElementRef, Injectable, ChangeDetectorRef, NgZone, HostBinding, Renderer2, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Platform } from '../platform/index';
import { Observable, Subject, Subscription, pipe } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
export class LyFocusState implements OnDestroy {
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
