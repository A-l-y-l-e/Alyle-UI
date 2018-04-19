import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import {
  LyCoreModule,
  LyTheme,
  AlyleServiceConfig } from 'alyle-ui/core';

@NgModule({
  imports: [ LyCoreModule, BrowserTransferStateModule ],
  exports: [ LyCoreModule ]
})
export class AlyleUIModule {
  static forRoot(config: AlyleServiceConfig): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        [ LyTheme ],
        { provide: AlyleServiceConfig, useValue: config }
      ]
    };
  }

  static setTheme(config: AlyleServiceConfig): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        { provide: AlyleServiceConfig, useValue: config }
      ]
    };
  }
}
