import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LySliderModule } from '@alyle/ui/slider';

import { BasicSliderComponent } from './basic-slider.component';

@NgModule({
  declarations: [BasicSliderComponent],
  imports: [
    CommonModule,
    LySliderModule
  ],
  exports: [BasicSliderComponent]
})
export class BasicSliderModule { }
