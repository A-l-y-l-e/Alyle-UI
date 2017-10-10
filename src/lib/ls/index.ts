import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf, Optional,
  InjectionToken }                       from '@angular/core';
import { Observable }                    from 'rxjs/Observable';
import { Subject }                       from 'rxjs/Subject';
import { BehaviorSubject }               from 'rxjs/BehaviorSubject';
import { MinimalLS } from './minimal-localstorage';
export * from './minimal-localstorage';

/* tslint:disable */
const MinimalLSConfigToken = new InjectionToken<string>('MinimalLSConfigToken');
/* tslint:enable */

export function _lsFactory(): MinimalLS {

  return new MinimalLS();
}
/* tslint:disable */
export const AlyleUIProvider = {
  provide: MinimalLS,
  useFactory: _lsFactory,
  deps: [MinimalLSConfigToken]
};
/* tslint:enable */

@NgModule({
  providers: [
    // AlyleUIProvider
    MinimalLS
  ]
})
export class MinimalLSModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: MinimalLSModule,
  //     providers: [
  //       { provide: MinimalLSConfigToken, useValue: false },
  //     ],
  //   };
  // }
}

export { MinimalLSConfigToken };
