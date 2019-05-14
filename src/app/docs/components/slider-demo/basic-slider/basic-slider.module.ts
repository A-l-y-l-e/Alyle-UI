import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSliderComponent } from './basic-slider.component';
import { LySliderModule } from '@alyle/ui/slider';

@NgModule({
  declarations: [BasicSliderComponent],
  imports: [
    CommonModule,
    LySliderModule
  ],
  exports: [BasicSliderComponent]
})
export class BasicSliderModule { }
