import { OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function componentDestroyed(component: OnDestroy): Observable<true> {
    const modifiedComponent = component as {
      __componentDestroyed$?: Observable<true>
      ngOnDestroy?(): void
    };
    if (modifiedComponent.__componentDestroyed$) {
        return modifiedComponent.__componentDestroyed$;
    }
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new ReplaySubject<true>();
    modifiedComponent.ngOnDestroy = function () {
      console.log('destroying component...', component);
        if (oldNgOnDestroy) {
          oldNgOnDestroy.apply(component);
        }
        stop$.next(true);
        stop$.complete();
    };
    return modifiedComponent.__componentDestroyed$ = stop$.asObservable();
}

export function untilComponentDestroyed<T>(component: OnDestroy): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component as OnDestroy)));
}
