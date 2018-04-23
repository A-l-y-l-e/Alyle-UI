import {
  NgModule, ModuleWithProviders,
  ViewContainerRef, SkipSelf,
  Optional } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import {
  LyCoreModule,
  LyTheme,
  ThemeVariables,
  PaletteVariables,
  PALETTE,
  IS_ROOT_THEME } from 'alyle-ui/core';

export function provideTheme(theme: ThemeVariables) {
  return [
    [ LyTheme ],
    { provide: ThemeVariables, useValue: theme }
  ];
}

@NgModule({
  imports: [ LyCoreModule, BrowserTransferStateModule ],
  exports: [ LyCoreModule ]
})
export class AlyleUIModule {
  /** Set a theme for core */
  static forRoot(theme: ThemeVariables, palette: PaletteVariables): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        provideTheme(theme),
        { provide: PALETTE, useValue: palette },
        { provide: IS_ROOT_THEME, useValue: true }
      ]
    };
  }

  /** Set a theme for this module */
  static forChild(theme: ThemeVariables): ModuleWithProviders {
    return {
      ngModule: AlyleUIModule,
      providers: [
        provideTheme(theme),
        { provide: IS_ROOT_THEME, useValue: false }
      ]
    };
  }
}

export const ProvidedInTheme = {
  providedIn: AlyleUIModule
};
