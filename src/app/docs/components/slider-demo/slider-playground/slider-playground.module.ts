import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LySliderModule } from '@alyle/ui/slider';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyFieldModule } from '@alyle/ui/field';
import { FormsModule } from '@angular/forms';

import { SliderPlaygroundComponent } from './slider-playground.component';

@NgModule({
  declarations: [SliderPlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    LySliderModule,
    LyCheckboxModule,
    LyFieldModule
  ],
  exports: [SliderPlaygroundComponent]
})
export class SliderPlaygroundModule { }
