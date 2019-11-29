import { NgModule, Type } from '@angular/core';

import { BasicSliderComponent } from './basic-slider/basic-slider.component';
import { SliderPlaygroundComponent } from './slider-playground/slider-playground.component';
import { BasicSliderModule } from './basic-slider/basic-slider.module';
import { SliderPlaygroundModule } from './slider-playground/slider-playground.module';

const elements = [
  BasicSliderComponent,
  SliderPlaygroundComponent
];

@NgModule({
  imports: [
    BasicSliderModule,
    SliderPlaygroundModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
