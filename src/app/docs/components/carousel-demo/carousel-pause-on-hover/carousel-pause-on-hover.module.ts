import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselPauseOnHoverComponent } from './carousel-pause-on-hover.component';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyTypographyModule } from '@alyle/ui/typography';



@NgModule({
  declarations: [CarouselPauseOnHoverComponent],
  imports: [
    CommonModule,
    LyCarouselModule,
    LyTypographyModule
  ],
  exports: [CarouselPauseOnHoverComponent]
})
export class CarouselPauseOnHoverModule { }
