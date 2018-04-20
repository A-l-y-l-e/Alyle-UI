import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import {
  LyCoreModule,
  LyTheme,
  AlyleServiceConfig } from 'alyle-ui/core';

export function provideTheme(theme: AlyleServiceConfig) {
  return [
    [ LyTheme ],
    { provide: AlyleServiceConfig, useValue: theme }
  ];
}

@NgModule({
  imports: [ LyCoreModule, BrowserTransferStateModule ],
  exports: [ LyCoreModule ]
})
export class AlyleUIModule {
  static forRoot(theme: AlyleServiceConfig): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: provideTheme(theme)
    };
  }

  static setTheme(theme: AlyleServiceConfig): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: provideTheme(theme)
    };
  }
}
