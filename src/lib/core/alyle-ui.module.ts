import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional,
  Inject
} from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { LyTheme } from './theme.service';
import { ThemeVariables, PaletteVariables, IS_CORE_THEME, THEME_VARIABLES, PALETTE } from './alyle-config-service';

export function provideTheme(theme: ThemeVariables): any[] {
  return [
    [ LyTheme ],
    { provide: THEME_VARIABLES, useValue: theme },
    { provide: PALETTE, useValue: {} },
  ];
}

@NgModule()
export class AlyleUIModule {
  /** Set a theme for core */
  static forRoot(theme: ThemeVariables): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        provideTheme(theme),
        { provide: IS_CORE_THEME, useValue: true },
      ]
    };
  }

  /** Set a theme for this module */
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
