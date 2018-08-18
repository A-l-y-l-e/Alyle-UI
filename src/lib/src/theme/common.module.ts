import { NgModule } from '@angular/core';

import { LyCommon } from './common.directive';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyNewRaised } from './raised.directive';
import { LyThemeContainer } from './theme.directive';
import { LyWithClass } from './with-class.directive';

@NgModule({
  declarations: [LyCommon, LyNewRaised, LyThemeContainer, LyWithClass],
  exports: [LyCommon, LyNewRaised, LyThemeContainer, LyWithClass],
  providers: [
    { provide: LY_GLOBAL_CONTRAST, useValue: false }
  ]
})
export class LyCommonModule { }
