import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyHammerGestureConfig } from '@alyle/ui';

import { LyResizingCroppingImages } from './resizing-cropping-images';

@NgModule({
  imports: [CommonModule],
  exports: [LyResizingCroppingImages],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ],
  declarations: [LyResizingCroppingImages]
})
export class LyResizingCroppingImageModule {}
