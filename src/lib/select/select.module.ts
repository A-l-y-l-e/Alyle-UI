import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule, LyOverlayModule } from '@alyle/ui';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

import { LySelect, LyOption } from './select';

@NgModule({
  declarations: [LySelect, LyOption],
  imports: [
    CommonModule,
    LyCommonModule,
    LyCheckboxModule,
    LyOverlayModule
  ],
  exports: [LySelect, LyOption, LyCommonModule]
})
export class LySelectModule { }
