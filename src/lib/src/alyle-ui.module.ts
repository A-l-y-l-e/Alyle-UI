import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional,
  Inject
} from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { LyTheme } from './theme.service';
import { ThemeVariables, PaletteVariables, IS_CORE_THEME, THEME_VARIABLES } from './alyle-config-service';
import { ThemeConfig, THEME_CONFIG, THEME_CONFIG_EXTRA} from './theme/theme-config';
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
   * Set theme or multiples themes
   * @param config variables
   */
  static setTheme(config: ThemeConfig | ThemeConfig[]): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        { provide: THEME_CONFIG, useValue: config },
      ]
    };
  }

  /**
   * Add extra variables for merge with current themes
   * @param config variables
   */
  static with(config: any): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        { provide: THEME_CONFIG_EXTRA, useValue: config },
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
