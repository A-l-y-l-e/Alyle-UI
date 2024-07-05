import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropperBasicUsageComponent } from './cropper-basic-usage.component';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';



@NgModule({
  declarations: [
    CropperBasicUsageComponent
  ],
  imports: [
    CommonModule,
    LyImageCropperModule,
    LyButtonModule,
    LyIconModule
  ]
})
export class CropperBasicUsageModule { }
