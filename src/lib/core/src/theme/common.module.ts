import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LyBgColorAndRaised } from './bg-color-and-raised.directive';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyNewRaised } from './raised.directive';
import { LyThemeContainer } from './theme.directive';
import { LyThemeModule } from './theme.module';

@NgModule({
  declarations: [LyBgColorAndRaised, LyNewRaised],
  exports: [LyBgColorAndRaised, LyNewRaised, LyThemeModule],
  providers: [
    { provide: LY_GLOBAL_CONTRAST, useValue: false }
  ]
})
export class LyCommonModule { }
