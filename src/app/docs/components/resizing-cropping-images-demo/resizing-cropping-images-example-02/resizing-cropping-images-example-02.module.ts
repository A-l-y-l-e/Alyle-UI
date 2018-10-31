import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizingCroppingImagesExample02Component } from './resizing-cropping-images-example-02.component';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyIconModule } from '@alyle/ui/icon';

@NgModule({
  imports: [
    CommonModule,
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconButtonModule,
    LyIconModule
  ],
  declarations: [ResizingCroppingImagesExample02Component],
  exports: [ResizingCroppingImagesExample02Component]
})
export class ResizingCroppingImagesExample02Module { }
