import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LySlider } from './slider';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  declarations: [LySlider],
  exports: [LySlider]
})
export class LySliderModule { }
