import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LySelect, LyOption } from './select';

@NgModule({
  declarations: [LySelect, LyOption],
  imports: [
    CommonModule
  ],
  exports: [LySelect, LyOption]
})
export class LySelectModule { }
