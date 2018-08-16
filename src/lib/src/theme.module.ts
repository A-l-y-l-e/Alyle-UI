import { NgModule, Optional, SkipSelf, Self, Host, ModuleWithProviders, InjectionToken } from '@angular/core';
import { LyTheme2 } from './theme/theme2.service';
import { LY_THEME_NAME } from './theme/theme-config';

@NgModule()
export class LyThemeModule {
  static setTheme(themeName: string): ModuleWithProviders {
    return {
      ngModule: LyThemeModule,
      providers: [
        [LyTheme2],
        { provide: LY_THEME_NAME, useValue: themeName }
      ]
    };
  }
}
