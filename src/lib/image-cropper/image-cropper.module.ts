import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LyImageCropper, LyCropperArea } from './image-cropper';


@NgModule({
  imports: [CommonModule],
  exports: [LyImageCropper],
  declarations: [LyImageCropper, LyCropperArea]
})
export class LyImageCropperModule { }
