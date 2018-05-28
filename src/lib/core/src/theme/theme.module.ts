import { NgModule, Optional, SkipSelf, Self, Host } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyThemeContainer } from './theme.directive';
import { LyTheme2 } from './theme2.service';
import { CoreTheme } from './core-theme.service';

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

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyThemeContainer],
  declarations: [LyThemeContainer],
  providers: []
})
export class LyThemeModule { }
