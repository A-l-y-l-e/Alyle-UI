import { Platform } from 'alyle-ui/core';
import { Injectable, NgZone, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { merge, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MediaQueries } from './media-queries';
import { PLATFORM_ID, APP_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
@Injectable()
export class Responsive {
  private static _queryMap: Map<string, boolean> = new Map<string, boolean>();
  constructor(
    private _ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  matchMedia(val: string): boolean {
    return !Platform.isBrowser ? false : matchMedia(val).matches;
  }

  /**
   * return Observable<boolean>
   */
  observe(value: string): Observable<boolean> {
    let mm = this.matchMedia(value);
    const mediaObservable = merge(of(true), this.stateView());
    return mediaObservable
    .pipe(
      filter((state) => {
        return this.matchMedia(value) !== mm || state === true;
      },
      map(() => {
        mm = this.matchMedia(value);
        this._registerMedia(value);
        return this.matchMedia(value);
      })
    ));
  }

  private _registerMedia(value: string) {
    Responsive._queryMap.set(value, this.matchMedia(value));
  }

  stateView(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this._ngZone.runOutsideAngular(() => {
        return fromEvent(window, 'resize');
      });
    }
    if (isPlatformServer(this.platformId)) {
      return of();
    }
  }

}
