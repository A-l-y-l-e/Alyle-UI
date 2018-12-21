import { Injectable, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent , Observable, empty } from 'rxjs';
import { map, share, auditTime } from 'rxjs/operators';

import { Platform } from '../platform/index';

@Injectable({
  providedIn: 'root'
})
export class WinResize {

  resize$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) private document: any,
    ngZone: NgZone
  ) {
    if (Platform.isBrowser) {
      ngZone.runOutsideAngular(() => {
        this.resize$ = fromEvent(window, 'resize').pipe(
          auditTime(20),
          map(() => {
            return window.innerHeight || this.document.documentElement.clientHeight;
          }),
          share()
        );
      });
    } else {
      this.resize$ = empty();
    }
  }
}
