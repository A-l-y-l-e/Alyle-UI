import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselWithGesturesComponent } from './carousel-with-gestures.component';
import { LyCarouselModule } from '@alyle/ui/carousel';

@NgModule({
  declarations: [CarouselWithGesturesComponent],
  imports: [
    CommonModule,
    LyCarouselModule
  ],
  exports: [CarouselWithGesturesComponent]
})
export class CarouselWithGesturesModule { }
