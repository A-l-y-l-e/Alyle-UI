import {
  Component,
  ContentChildren,
  Directive,
  Input,
  QueryList,
  NgModule,
  ModuleWithProviders,
  ElementRef,
  ViewContainerRef,
  Injectable,
}                          from '@angular/core';
import { Observable }      from 'rxjs/Observable';
import { Subject }         from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer }        from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { CommonModule }    from '@angular/common';

export class MinimalStorage {
  constructor(key$: string, val: any) {
    localStorage.setItem(key$, JSON.stringify(val));
  }
}

@Injectable()
export class MinimalLS {
  private itemsSubject: Map<string, Subject<string>> = new Map<string, BehaviorSubject<string>>();
  private _prefix = '*ls*';
  constructor() {
    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    let len = localStorage.length;
    for (let i = 0; i < len; i++) {
      let key = localStorage.key(i);
      try {
        // let key = console.log(JSON.parse(localStorage.getItem(this._removePrefix(key))));
        let key$ = this._removePrefix(key);
        let parse = JSON.parse(localStorage.getItem(key));
        this.setItem(key$, parse, false);
      } catch (e) { }
    }
  }

  /**
   * get boolean
   */
  hasItem(key$: string): boolean {
    let key = this._addPrefix(key$);
    return !!localStorage.getItem(key);
  }
  /**
   * Set new item or replace item
   */
  setItem(key$: string, val: any, _storage = true) {
    let key = this._addPrefix(key$);
    this.itemsSubject.set(key, new BehaviorSubject<string>(val));
    if (_storage) {
      new MinimalStorage(key, val);
    }
  }
  /**
   * Get Observable from localStorage
   */
  getItem(key$: string, before?: any): Observable<any> {
    let key = this._addPrefix(key$);
    if (this.itemsSubject.has(key)) {
      return this.itemsSubject.get(key).asObservable().share();
    }
    if (before) {
      return new BehaviorSubject<any>(before).asObservable();
    }
    return;
  }
  /**
   * Get value from localstorage
   */
  item(key$: string): any {
    let key = this._addPrefix(key$);
    try {
      return JSON.parse(window.localStorage[key]);
    } catch (e) {
      return null;
    }
  }

  private _addPrefix(val) {
    return `{"${this._prefix}":"${val}"}`
  }
  private _removePrefix(val) {
    try {
      return JSON.parse(val)[this._prefix];
    } catch (e) {
      return null;
    }
  }
}

@NgModule({
  providers: [MinimalLS]
})
export class MinimalLSModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MinimalLSModule,
      providers: [],
    };
  }
}
