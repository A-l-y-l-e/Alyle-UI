import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyToolbar } from './toolbar';

@NgModule({
  imports: [CommonModule],
  exports: [LyToolbar],
  declarations: [LyToolbar]
})
export class LyToolbarModule { }
