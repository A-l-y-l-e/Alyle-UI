import { NgModule } from '@angular/core';

import { LyImageCropper, LyCropperArea } from './image-cropper';
import { LyImageCropperBase } from './image-cropper-base';


@NgModule({
  imports: [LyImageCropper, LyCropperArea],
  exports: [LyImageCropper, LyCropperArea]
})
export class LyImageCropperModule { }

@NgModule({
  imports: [LyImageCropperBase],
  exports: [LyImageCropperBase]
})
export class LyImageCropperBaseModule { }
