import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional, InjectionToken } from '@angular/core';
import {
  LyCoreModule,
  LyTheme,
  AlyleServiceConfig } from 'alyle-ui/core';

/**
 * @version
 */
export const AUI_VERSION = '{@version}';

@NgModule({
  imports: [LyCoreModule],
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
    };
  }
}
