import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';

import { ResizingCroppingImagesExample01Component } from './resizing-cropping-images-example-01.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconModule
  ],
  exports: [ResizingCroppingImagesExample01Component],
  declarations: [ResizingCroppingImagesExample01Component]
})
export class ResizingCroppingImagesExample01Module { }
