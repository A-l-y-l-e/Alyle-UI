import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyTypographyModule } from '@alyle/ui/typography';

import { CarouselExample01Component } from './carousel-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyCarouselModule,
    LyTypographyModule
  ],
  exports: [CarouselExample01Component],
  declarations: [CarouselExample01Component]
})
export class CarouselExample01Module { }
