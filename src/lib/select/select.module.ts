import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule, LyOverlayModule } from '@alyle/ui';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

import { LySelect, LyOption, LySelectTrigger } from './select';

@NgModule({
  declarations: [LySelect, LyOption, LySelectTrigger],
  imports: [
    CommonModule,
    LyCommonModule,
    LyCheckboxModule,
    LyOverlayModule
  ],
  exports: [LySelect, LyOption, LySelectTrigger, LyCommonModule]
})
export class LySelectModule { }
