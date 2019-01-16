import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LySelect } from './select';

@NgModule({
  declarations: [LySelect],
  imports: [
    CommonModule
  ],
  exports: [LySelect]
})
export class LySelectModule { }
