import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyBg } from './bg.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyBg],
  declarations: [LyBg]
})
export class BgModule { }
