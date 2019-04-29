import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSliderComponent } from './basic-slider.component';

@NgModule({
  declarations: [BasicSliderComponent],
  imports: [
    CommonModule
  ],
  exports: [BasicSliderComponent]
})
export class BasicSliderModule { }
