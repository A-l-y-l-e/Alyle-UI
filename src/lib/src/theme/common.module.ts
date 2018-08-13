import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LyBgColorAndRaised } from './bg-color-and-raised.directive';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyNewRaised } from './raised.directive';
import { LyThemeContainer } from './theme.directive';
import { LyStyleName } from './style-name.directive';

@NgModule({
  declarations: [LyBgColorAndRaised, LyNewRaised, LyThemeContainer, LyStyleName],
  exports: [LyBgColorAndRaised, LyNewRaised, LyThemeContainer, LyStyleName],
  providers: [
    { provide: LY_GLOBAL_CONTRAST, useValue: false }
  ]
})
export class LyCommonModule { }
