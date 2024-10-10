import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyImageCropperBaseModule } from '@alyle/ui/image-cropper';
import { LySliderModule } from '@alyle/ui/slider';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LyDialogModule } from '@alyle/ui/dialog';

import { CropperWithDialogComponent } from './cropper-with-dialog.component';
import { CropperDialog } from './cropper-dialog';



@NgModule({
  declarations: [
    CropperWithDialogComponent,
    CropperDialog
  ],
  imports: [
    CommonModule,
    FormsModule,
    LyImageCropperBaseModule,
    LySliderModule,
    LyButtonModule,
    LyIconModule,
    LyDialogModule
  ],
  exports: [CropperWithDialogComponent]
})
export class CropperWithDialogModule { }
