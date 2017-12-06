import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf, Optional,
  InjectionToken }                       from '@angular/core';
import { Observable }                    from 'rxjs/Observable';
import { Subject }                       from 'rxjs/Subject';
import { BehaviorSubject }               from 'rxjs/BehaviorSubject';
import { MinimalLS } from './minimal-localstorage';
export * from './minimal-localstorage';

@NgModule({
  providers: [
    MinimalLS
  ]
})
export class MinimalLSModule { }
