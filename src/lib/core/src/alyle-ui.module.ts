import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional,
  Inject
} from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { LyTheme } from './theme.service';
import { ThemeVariables, PaletteVariables, IS_CORE_THEME, THEME_VARIABLES } from './alyle-config-service';
import { ThemeConfig, THEME_CONFIG } from './theme/theme-config';
import { CoreTheme } from './theme/core-theme.service';

export function provideTheme(theme: ThemeVariables): any[] {
  return [
    [ LyTheme ],
    { provide: THEME_VARIABLES, useValue: theme },
  ];
}

@NgModule()
export class AlyleUIModule {
  /**
   * set theme or multiples themes
   * @param config variables
   */
  static setThemeConfig(config: ThemeConfig | ThemeConfig[]): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        { provide: THEME_CONFIG, useValue: config },
      ]
    };
  }

  /**
   * @deprecated
   * Set a theme for core
   */
  static forRoot(theme: ThemeVariables): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        provideTheme(theme),
        { provide: IS_CORE_THEME, useValue: true },
      ]
    };
  }

  /**
   * @deprecated
   * Set a theme for this module
   */
  static forChild(theme: ThemeVariables): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        provideTheme(theme),
        { provide: IS_CORE_THEME, useValue: false }
      ]
    };
  }
}

export const ProvidedInTheme = {
  providedIn: AlyleUIModule
};
