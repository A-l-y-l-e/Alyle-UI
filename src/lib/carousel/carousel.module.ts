import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCarouselItem, LyCarousel } from './carousel';
import { LyCommonModule } from '@alyle/ui';
import { LyRippleModule } from '@alyle/ui/ripple';

const LY_CAROUSEL_DIRECTIVES = [LyCarouselItem, LyCarousel];

@NgModule({
  imports: [CommonModule, LyCommonModule, LyRippleModule],
  exports: [LY_CAROUSEL_DIRECTIVES, LyCommonModule],
  declarations: [LY_CAROUSEL_DIRECTIVES]
})
export class LyCarouselModule { }
