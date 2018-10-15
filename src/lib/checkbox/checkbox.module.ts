import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { LyCheckbox } from './checkbox';

@NgModule({
  declarations: [
    LyCheckbox
  ],
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [
    LyCommonModule,
    LyCheckbox
  ]
})
export class LyCheckboxModule { }
