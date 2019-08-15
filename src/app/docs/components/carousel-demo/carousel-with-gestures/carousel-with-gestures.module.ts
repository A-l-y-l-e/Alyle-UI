import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyTypographyModule } from '@alyle/ui/typography';

import { CarouselWithGesturesComponent } from './carousel-with-gestures.component';

@NgModule({
  declarations: [CarouselWithGesturesComponent],
  imports: [
    CommonModule,
    LyCarouselModule,
    LyTypographyModule
  ],
  exports: [CarouselWithGesturesComponent]
})
export class CarouselWithGesturesModule { }
