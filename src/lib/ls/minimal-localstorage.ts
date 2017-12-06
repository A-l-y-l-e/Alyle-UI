import {
  NgModule,
  ModuleWithProviders,
  ElementRef,
  ViewContainerRef,
  Injectable,
  Inject
}                          from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable }      from 'rxjs/Observable';
import { Subject }         from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer }        from 'rxjs/Observer';
import { CommonModule }    from '@angular/common';
import { fromEvent } from 'rxjs/observable/fromEvent';

export class MinimalStorage {
  constructor(key$: string, val: any) {
    localStorage.setItem(key$, JSON.stringify(val));
  }
}

@Injectable()
export class MinimalLS {
  private itemsSubject: Map<string, Subject<string>> = new Map<string, BehaviorSubject<string>>();
  private _prefix = '*ls*';
  private storageEvent: Observable<any>;
  private storage = new Subject();
  private storageObservable: Observable<any>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.storageEvent = fromEvent(window, 'storage');
      this.storageEvent.subscribe((e) => {
        this.storage.next({
          key: e.key,
          value: e.newValue
        });
      });
      this.storageObservable = this.storage.asObservable();
    }
  }

  /**
   * get boolean
   */
  hasItem(key$: string): boolean {
    const key = this._addPrefix(key$);
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(key);
    }
    if (isPlatformServer(this.platformId)){
      return false;
    }
  }
  /**
   * Set new item or replace item
   */
  setItem(key$: string, val: any, _storage = true) {
    const key = this._addPrefix(key$);
    if (_storage) {
      if (isPlatformBrowser(this.platformId)) {
        // tslint:disable-next-line:no-unused-expression
        new MinimalStorage(key, val);
      }
    }
    this.storage.next({
      key: key,
      value: this.item(key$)
    });
    // this.itemsSubject.set(key, new BehaviorSubject<string>(val));
  }
  /**
   * Get Observable from localStorage
   */
  getItem(key$: string, before?: any): Observable<any> {
    const key = this._addPrefix(key$);
    const ob = new Observable((observer) => {
      if (this.hasItem(key$)) {
        observer.next(this.item(key$));
      }
      this.storageObservable.subscribe((e) => {
        if (key === e.key) {
          observer.next(e.value);
        }
      });
    });
    return ob;
  }
  /**
   * Get value from localstorage
   */
  item(key$: string): any {
    const key = this._addPrefix(key$);
    try {
      return JSON.parse(window.localStorage[key]);
    } catch (e) {
      return null;
    }
  }

  private _addPrefix(val) {
    return `{"${this._prefix}":"${val}"}`;
  }
  private _removePrefix(val) {
    try {
      return JSON.parse(val)[this._prefix];
    } catch (e) {
      return null;
    }
  }
}

