import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LySliderModule } from '@alyle/ui/slider';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyFieldModule } from '@alyle/ui/field';
import { LyRadioModule } from '@alyle/ui/radio';

import { SliderPlaygroundComponent } from './slider-playground.component';

@NgModule({
  declarations: [SliderPlaygroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    LySliderModule,
    LyCheckboxModule,
    LyFieldModule,
    LyRadioModule
  ],
  exports: [SliderPlaygroundComponent]
})
export class SliderPlaygroundModule { }
