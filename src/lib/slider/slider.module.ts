import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';
import { LySlider } from './slider';
import { LyMark } from './mark';
import { LyTick } from './tick';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  declarations: [LySlider, LyMark, LyTick],
  exports: [LySlider, LyMark]
})
export class LySliderModule { }
