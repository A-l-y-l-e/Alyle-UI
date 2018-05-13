import { NgModule } from '@angular/core';

import { LyBgColorAndRaised } from './bg-color-and-raised.directive';
import { LY_GLOBAL_CONTRAST } from './contrast';
import { LyNewRaised } from './raised.directive';

@NgModule({
  declarations: [LyBgColorAndRaised, LyNewRaised],
  exports: [LyBgColorAndRaised, LyNewRaised],
  providers: [
    { provide: LY_GLOBAL_CONTRAST, useValue: false }
  ]
})
export class LyCommonModule { }
