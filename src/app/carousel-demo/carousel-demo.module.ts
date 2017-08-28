import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselDemoRoutingModule } from './carousel-demo-routing.module';
import { CarouselDemoComponent } from './carousel-demo/carousel-demo.component';
import { DemoViewModule } from '../demo-view';
import { CarouselExample01Module } from './carousel-example-01/carousel-example-01.module';

@NgModule({
  imports: [
    CommonModule,
    CarouselDemoRoutingModule,
    DemoViewModule,
    CarouselExample01Module
  ],
  declarations: [CarouselDemoComponent]
})
export class CarouselDemoModule { }
