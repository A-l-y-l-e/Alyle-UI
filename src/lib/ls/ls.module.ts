import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf, Optional,
  InjectionToken }                       from '@angular/core';
import { MinimalLS } from './minimal-localstorage';

@NgModule({
  providers: [
    MinimalLS
  ]
})
export class MinimalLSModule { }
