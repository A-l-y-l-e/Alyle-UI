import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { auditTime, map, share } from 'rxjs/operators';
import { empty, fromEvent, Observable } from 'rxjs';
import { Platform } from '../platform/platform';

/**
 * @deprecated use ScrollDispatcher instead
 * import { ScrollDispatcher } from '@angular/cdk/scrolling';
 */
@Injectable({
  providedIn: 'root'
})
export class WinScroll {

  scroll$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    ngZone: NgZone
  ) {
    if (Platform.isBrowser) {
      ngZone.runOutsideAngular(() => {
        this.scroll$ = fromEvent(window.document, 'scroll').pipe(
          auditTime(20),
          map(() => {
            return window.scrollY || this._document.documentElement.scrollTop;
          }),
          share()
        );
      });
    } else {
      this.scroll$ = empty();
    }
  }
}
