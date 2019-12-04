import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperExample03Component } from './image-cropper-example-03.component';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyImageCropperModule,
    LyButtonModule,
    LyIconModule
  ],
  declarations: [ImageCropperExample03Component],
  exports: [ImageCropperExample03Component]
})
export class ImageCropperExample03Module { }
