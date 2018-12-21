import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { auditTime, map, share } from 'rxjs/operators';
import { empty, fromEvent, Observable } from 'rxjs';
import { Platform } from '@alyle/ui';

@Injectable({
  providedIn: 'root'
})
export class WinScroll {

  scroll$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    ngZone: NgZone
  ) {
    if (Platform.isBrowser) {
      ngZone.runOutsideAngular(() => {
        this.scroll$ = fromEvent(window.document, 'scroll').pipe(
          auditTime(20),
          map(() => {
            return window.scrollY || this.document.documentElement.scrollTop;
          }),
          share()
        );
      });
    } else {
      this.scroll$ = empty();
    }
  }
}
