import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional, InjectionToken } from '@angular/core';
import {
  LyCoreModule,
  LyTheme,
  AlyleServiceConfig } from 'alyle-ui/core';

export const AUI_VERSION = '1.4.3';

@NgModule({
  imports: [LyCoreModule.forRoot()],
  exports: [LyCoreModule],
  providers: [
    LyTheme
  ]
})
export class AlyleUIModule {
  static forRoot(config: AlyleServiceConfig): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        { provide: AlyleServiceConfig, useValue: config }
      ]
    }
  }
}
