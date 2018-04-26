import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LyShadowModule, LyShadowService } from '@alyle/ui/shadow';
import { LyCarouselItemComponent, LyCarousel } from './carousel';
import { CarouselService } from './carousel.service';

const LY_CAROUSEL_DIRECTIVES = [LyCarouselItemComponent, LyCarousel];

@NgModule({
  imports: [CommonModule, FormsModule, LyShadowModule],
  exports: [LY_CAROUSEL_DIRECTIVES],
  declarations: [LY_CAROUSEL_DIRECTIVES],
  providers: [LyShadowService, CarouselService]
})
export class LyCarouselModule { }
