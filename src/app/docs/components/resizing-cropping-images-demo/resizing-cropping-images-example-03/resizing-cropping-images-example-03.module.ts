import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizingCroppingImagesExample03Component } from './resizing-cropping-images-example-03.component';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyInputModule } from '@alyle/ui/input';

@NgModule({
  imports: [
    CommonModule,
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconButtonModule,
    LyIconModule,
    LyInputModule
  ],
  declarations: [ResizingCroppingImagesExample03Component],
  exports: [ResizingCroppingImagesExample03Component]
})
export class ResizingCroppingImagesExample03Module { }
