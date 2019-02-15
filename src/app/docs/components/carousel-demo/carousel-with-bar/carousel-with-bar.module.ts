import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselModule } from '@alyle/ui/carousel';

import { CarouselWithBarComponent } from './carousel-with-bar.component';

@NgModule({
  declarations: [CarouselWithBarComponent],
  imports: [
    CommonModule,
    LyCarouselModule
  ],
  exports: [CarouselWithBarComponent]
})
export class CarouselWithBarModule { }
