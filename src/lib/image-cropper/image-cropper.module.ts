import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LyImageCropper } from './image-cropper';
import { LyCropperArea } from './image-cropper-area';

@NgModule({
  imports: [CommonModule],
  exports: [LyImageCropper],
  declarations: [LyImageCropper, LyCropperArea]
})
export class LyImageCropperModule { }
