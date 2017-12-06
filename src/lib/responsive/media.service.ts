import { LyTheme } from 'alyle-ui/core';
import { Injectable, NgZone, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { MediaQueries } from './media-queries';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable()
export class Responsive {
  private static _queryMap: Map<string, boolean> = new Map<string, boolean>();
  private _stateView: Observable<any> = Observable.of();
  constructor(private _ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
    this._ngZone.runOutsideAngular(() => {
      this._stateView = fromEvent(window, 'resize');
    });
    }
  }

  matchMedia(val: string): boolean {
    if (MediaQueries[val]) {
      return matchMedia(MediaQueries[val]).matches;
    } else {
      return matchMedia(val).matches;
    }
  }

  /**
   * return Observable<boolean>
   */
  observe(value: string): Observable<boolean> {
    let mm = this.matchMedia(value);
    const mediaObservable = merge(of(true), this._stateView);
    return mediaObservable
    .filter((state) => {
      return this.matchMedia(value) !== mm || state === true;
    })
    .map(() => {
      mm = this.matchMedia(value);
      this._registerMedia(value);
      return this.matchMedia(value);
    });
  }

  private _registerMedia(value: string) {
    Responsive._queryMap.set(value, this.matchMedia(value));
  }

  get stateView(): Observable<any> {
    return this._stateView;
  }

}
