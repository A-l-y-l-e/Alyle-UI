import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconButtonModule } from '@alyle/ui/icon-button';
import { LyInputModule } from '@alyle/ui/input';

import { ResizingCroppingImagesExample01Component } from './resizing-cropping-images-example-01.component';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyCommonModule,
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconButtonModule,
    LyInputModule
  ],
  exports: [ResizingCroppingImagesExample01Component],
  declarations: [ResizingCroppingImagesExample01Component]
})
export class ResizingCroppingImagesExample01Module { }
