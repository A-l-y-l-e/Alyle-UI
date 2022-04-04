import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderCustomMarksComponent } from './slider-custom-marks.component';
import { LySliderModule } from '@alyle/ui/slider';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SliderCustomMarksComponent
  ],
  imports: [
    CommonModule,
    LySliderModule,
    ReactiveFormsModule
  ]
})
export class SliderCustomMarksModule { }
