import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderSizesComponent } from './slider-sizes.component';
import { LySliderModule } from '@alyle/ui/slider';



@NgModule({
  declarations: [
    SliderSizesComponent
  ],
  imports: [
    CommonModule,
    LySliderModule
  ]
})
export class SliderSizesModule { }
