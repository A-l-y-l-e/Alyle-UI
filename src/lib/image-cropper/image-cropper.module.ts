import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyHammerGestureConfig } from '@alyle/ui';

import { LyImageCropper } from './image-cropper';

@NgModule({
  imports: [CommonModule],
  exports: [LyImageCropper],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
  ],
  declarations: [LyImageCropper]
})
export class LyImageCropperModule {}
