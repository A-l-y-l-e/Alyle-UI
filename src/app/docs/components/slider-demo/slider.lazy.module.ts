import { NgModule, Type } from '@angular/core';

import { BasicSliderComponent } from './basic-slider/basic-slider.component';
import { SliderPlaygroundComponent } from './slider-playground/slider-playground.component';
import { BasicSliderModule } from './basic-slider/basic-slider.module';
import { SliderPlaygroundModule } from './slider-playground/slider-playground.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';
import { SliderCustomMarksComponent } from './slider-custom-marks/slider-custom-marks.component';
import { SliderCustomMarksModule } from './slider-custom-marks/slider-custom-marks.module';
import { SliderSizesModule } from './slider-sizes/slider-sizes.module';
import { SliderSizesComponent } from './slider-sizes/slider-sizes.component';

const elements = [
  BasicSliderComponent,
  SliderPlaygroundComponent,
  SliderCustomMarksComponent,
  SliderSizesComponent
];

@NgModule({
  imports: [
    BasicSliderModule,
    SliderPlaygroundModule,
    SliderCustomMarksModule,
    SliderSizesModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
