import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropperBasicUsageComponent } from './cropper-basic-usage.component';
import { LyImageCropperBaseModule } from '@alyle/ui/image-cropper';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';



@NgModule({
  declarations: [
    CropperBasicUsageComponent
  ],
  imports: [
    CommonModule,
    LyImageCropperBaseModule,
    LyButtonModule,
    LyIconModule
  ]
})
export class CropperBasicUsageModule { }
