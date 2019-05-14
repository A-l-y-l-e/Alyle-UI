import { NgModule } from '@angular/core';
import { LySlider } from './slider';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    LyCommonModule
  ],
  declarations: [LySlider],
  exports: [LySlider]
})
export class LySliderModule { }
