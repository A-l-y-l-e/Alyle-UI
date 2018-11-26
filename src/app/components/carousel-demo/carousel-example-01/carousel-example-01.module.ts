import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselModule } from '@alyle/ui/carousel';

import { CarouselExample01Component } from './carousel-example-01.component';
import { LyButtonModule } from '@alyle/ui/button';

@NgModule({
  imports: [
    CommonModule,
    LyCarouselModule,
    LyButtonModule
  ],
  exports: [CarouselExample01Component],
  declarations: [CarouselExample01Component]
})
export class CarouselExample01Module { }
