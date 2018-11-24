import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselItem, LyCarousel } from './carousel';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [CommonModule, LyCommonModule],
  exports: [LyCarouselItem, LyCarousel, LyCommonModule],
  declarations: [LyCarouselItem, LyCarousel]
})
export class LyCarouselModule { }
