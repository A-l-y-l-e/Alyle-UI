import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional,
  Inject
} from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import {
  LyCoreModule,
  LyTheme,
  ThemeVariables,
  PaletteVariables,
  IS_CORE_THEME,
  THEME_VARIABLES,
  CORE_THEME_VARIABLES,
  PALETTE
} from 'alyle-ui/core';

export function provideTheme(theme: ThemeVariables) {
  return [
    [ LyTheme ],
    { provide: THEME_VARIABLES, useValue: theme },
    { provide: PALETTE, useValue: {} },
  ];
}

@NgModule({
  imports: [ LyCoreModule ],
  exports: [ LyCoreModule ]
})
export class AlyleUIModule {
  /** Set a theme for core */
  static forRoot(theme: ThemeVariables): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        provideTheme(theme),
        { provide: IS_CORE_THEME, useValue: true },
        { provide: CORE_THEME_VARIABLES, useValue: false }
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
