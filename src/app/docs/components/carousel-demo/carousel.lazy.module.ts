import { NgModule, Type } from '@angular/core';

import { CarouselExample01Component } from './carousel-example-01/carousel-example-01.component';
import { CarouselWithGesturesComponent } from './carousel-with-gestures/carousel-with-gestures.component';
import { CarouselWithBarComponent } from './carousel-with-bar/carousel-with-bar.component';
import { CarouselPauseOnHoverComponent } from './carousel-pause-on-hover/carousel-pause-on-hover.component';
import { CarouselExample01Module } from './carousel-example-01/carousel-example-01.module';
import { CarouselWithGesturesModule } from './carousel-with-gestures/carousel-with-gestures.module';
import { CarouselWithBarModule } from './carousel-with-bar/carousel-with-bar.module';
import { CarouselPauseOnHoverModule } from './carousel-pause-on-hover/carousel-pause-on-hover.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';


const elements = [
  CarouselExample01Component,
  CarouselWithGesturesComponent,
  CarouselWithBarComponent,
  CarouselPauseOnHoverComponent
];

@NgModule({
  imports: [
    CarouselExample01Module,
    CarouselWithGesturesModule,
    CarouselWithBarModule,
    CarouselPauseOnHoverModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
