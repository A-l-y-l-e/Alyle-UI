import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyButtonModule } from '@alyle/ui/button';
import { LySliderModule } from '@alyle/ui/slider';
import { LyIconModule } from '@alyle/ui/icon';

import { FullCropperWidthComponent } from './full-cropper-width.component';



@NgModule({
  declarations: [FullCropperWidthComponent],
  imports: [
    CommonModule,
    FormsModule,
    LyImageCropperModule,
    LyButtonModule,
    LySliderModule,
    LyIconModule
  ],
  exports: [FullCropperWidthComponent]
})
export class FullCropperWidthModule { }
