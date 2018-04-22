import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyBg, LyBgContrastTex } from './bg.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LyBg, LyBgContrastTex],
  declarations: [LyBg, LyBgContrastTex]
})
export class BgModule { }
