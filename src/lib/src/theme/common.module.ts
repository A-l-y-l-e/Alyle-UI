import { NgModule, Optional, SkipSelf, Directive, Input } from '@angular/core';

import { LyBgColorAndRaised } from './bg-color-and-raised.directive';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyNewRaised } from './raised.directive';
import { LyThemeContainer } from './theme.directive';
import { LyWithClass } from './with-class.directive';

@NgModule({
  declarations: [LyBgColorAndRaised, LyNewRaised, LyThemeContainer, LyWithClass],
  exports: [LyBgColorAndRaised, LyNewRaised, LyThemeContainer, LyWithClass],
  providers: [
    { provide: LY_GLOBAL_CONTRAST, useValue: false }
  ]
})
export class LyCommonModule { }
