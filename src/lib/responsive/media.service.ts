import { Injectable, Optional, NgZone, ApplicationRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { ResponsiveList } from './responsive-list';
import { ElementRef } from '@angular/core';

@Injectable()
export class ResponsiveService {
  private _stateView: Observable<any>;
  private _media: BehaviorSubject<any>;
  private _eventResize: Subscription;
  constructor(@Optional() list: ResponsiveList, private _ngZone: NgZone) {
    this._ngZone.runOutsideAngular(() => {
      this._stateView = fromEvent(window, 'resize');
    });
  }

  /**
   * TODO: crear responsive list
   */

  matchMedia(val: string): boolean {
    return matchMedia(val).matches;
  }

  /**
   * TODO: fix this
   * Use only in component.ts not in html
   * for html use *lyMedia="{"min-width": '720px'}"
   * demo:
   * media({"min-width": '720px'}).suscribe((state: boolean) => fn());
   */
  // media(key$: string): Observable<boolean> {
  //   if (this.itemsSubject.has(key$)) {
  //     return this.itemsSubject.get(key$).asObservable().share();
  //   } else {
  //     return;
  //   }
  // }

  get stateView(): Observable<any> {
    return this._stateView;
  }

}
