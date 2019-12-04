import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperExample02Component } from './image-cropper-example-02.component';
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
  declarations: [ImageCropperExample02Component],
  exports: [ImageCropperExample02Component]
})
export class ImageCropperExample02Module { }
