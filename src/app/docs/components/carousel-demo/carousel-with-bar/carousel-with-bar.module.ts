import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyTypographyModule } from '@alyle/ui/typography';

import { CarouselWithBarComponent } from './carousel-with-bar.component';

@NgModule({
  declarations: [CarouselWithBarComponent],
  imports: [
    CommonModule,
    LyCarouselModule,
    LyTypographyModule
  ],
  exports: [CarouselWithBarComponent]
})
export class CarouselWithBarModule { }
