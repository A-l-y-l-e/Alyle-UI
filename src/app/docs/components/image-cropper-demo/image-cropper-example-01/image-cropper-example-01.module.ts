import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LySliderModule } from '@alyle/ui/slider';

import { ImageCropperExample01Component } from './image-cropper-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyImageCropperModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [ImageCropperExample01Component],
  declarations: [ImageCropperExample01Component]
})
export class ImageCropperExample01Module { }
