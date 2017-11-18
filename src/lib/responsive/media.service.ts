import { Injectable, Optional, NgZone} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { WindowSize } from './window-size';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { ResponsiveList } from './responsive-list';

@Injectable()
export class ResponsiveService {
  private itemsSubject: Map<string, Subject<boolean>> = new Map<string, BehaviorSubject<boolean>>();
  private _stateView: Observable<WindowSize>;
  private _media: BehaviorSubject<any>;
  private _mediasSupport: string[] = ['min-width'];

  constructor(@Optional() list: ResponsiveList, private _ngZone: NgZone) {
    this._ngZone.runOutsideAngular(() => {
      this._stateView = new Observable((observer: Observer<WindowSize>) => {
        observer.next(this.size);
        this.itemsSubject.set('min-width', new BehaviorSubject<boolean>(false));
        addEventListener('resize', (eve: Event) => {
          observer.next(this.size);
        });
      });
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
  media(key$: string): Observable<boolean> {
    if (this.itemsSubject.has(key$)) {
      return this.itemsSubject.get(key$).asObservable().share();
    } else {
      return
    }
  }

  converterToPx(num: string): number {
    return parseFloat(num.replace('px', ''));
  }

  /**
   * Get width and height of window
   * @return {WindowSize}
   */
  get size(): WindowSize {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  get stateView(): Observable<WindowSize> {
    return this._stateView;
  }

}
