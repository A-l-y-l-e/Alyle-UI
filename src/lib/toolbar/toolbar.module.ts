import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LyToolbar } from './toolbar';

@NgModule({
  imports: [CommonModule, LyCommonModule],
  exports: [LyToolbar, LyCommonModule],
  declarations: [LyToolbar]
})
export class LyToolbarModule { }
