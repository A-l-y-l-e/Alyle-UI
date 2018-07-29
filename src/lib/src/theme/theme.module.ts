import { NgModule, Optional, SkipSelf, Self, Host, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyThemeContainer } from './theme.directive';
import { LyTheme2 } from './theme2.service';
import { CoreTheme } from './core-theme.service';
import { LY_THEME_NAME } from './theme-config';

// export function THEME2_PROVIDER_FACTORY(
//   parentRegistry: LyTheme2,
//   coreTheme: CoreTheme) {
//   return parentRegistry || new LyTheme2(coreTheme);
// }

// /** @docs-private */
// export const THEME2_PROVIDER = {
//   // If there is already an LyTheme2 available, use that. Otherwise, provide a new one.
//   provide: LyTheme2,
//   deps: [
//     [new Optional(), LyTheme2],
//     [CoreTheme]
//   ],
//   useFactory: THEME2_PROVIDER_FACTORY,
// };

@NgModule()
export class LyThemeModule {
  static setTheme(themeName: string): ModuleWithProviders {
    return {
      ngModule: LyThemeModule,
      providers: [
        LyTheme2,
        { provide: LY_THEME_NAME, useValue: themeName }
      ]
    };
  }
}
