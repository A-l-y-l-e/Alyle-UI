import { NgModule, ModuleWithProviders } from '@angular/core';
import { LyTheme2 } from './theme/theme2.service';
import { LY_THEME_NAME } from './theme/theme-config';
import { StyleRenderer } from './minimal/renderer-style';

@NgModule()
export class LyThemeModule {
  static setTheme(themeName: string): ModuleWithProviders {
    return {
      ngModule: LyThemeModule,
      providers: [
        [ LyTheme2 ],
        [ StyleRenderer ],
        { provide: LY_THEME_NAME, useValue: themeName }
      ]
    };
  }
}
