import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LyCarouselItem, LyCarousel } from './carousel';
import { CarouselService } from './carousel.service';
import { LyCommonModule } from '@alyle/ui';
import { LyRippleModule } from '@alyle/ui/ripple';

const LY_CAROUSEL_DIRECTIVES = [LyCarouselItem, LyCarousel];

@NgModule({
  imports: [CommonModule, LyCommonModule, LyRippleModule],
  exports: [LY_CAROUSEL_DIRECTIVES],
  declarations: [LY_CAROUSEL_DIRECTIVES]
})
export class LyCarouselModule { }
