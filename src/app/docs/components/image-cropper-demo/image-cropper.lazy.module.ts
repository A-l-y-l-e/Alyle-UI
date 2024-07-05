import { NgModule, Type } from '@angular/core';

import { CropperBasicUsageComponent } from './cropper-basic-usage/cropper-basic-usage.component';
import { ImageCropperExample01Component } from './image-cropper-example-01/image-cropper-example-01.component';
import { ImageCropperExample02Component } from './image-cropper-example-02/image-cropper-example-02.component';
import { ImageCropperExample03Component } from './image-cropper-example-03/image-cropper-example-03.component';
import { CropperBasicUsageModule } from './cropper-basic-usage/cropper-basic-usage.module';
import { ImageCropperExample01Module } from './image-cropper-example-01/image-cropper-example-01.module';
import { ImageCropperExample02Module } from './image-cropper-example-02/image-cropper-example-02.module';
import { ImageCropperExample03Module } from './image-cropper-example-03/image-cropper-example-03.module';
import { CropperWithDialogModule } from './cropper-with-dialog/cropper-with-dialog.module';
import { CropperWithDialogComponent } from './cropper-with-dialog/cropper-with-dialog.component';
import { CropCircleModule } from './crop-circle/crop-circle.module';
import { CropCircleComponent } from './crop-circle/crop-circle.component';
import { FullCropperWidthModule } from './full-cropper-width/full-cropper-width.module';
import { FullCropperWidthComponent } from './full-cropper-width/full-cropper-width.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  CropperBasicUsageComponent,
  ImageCropperExample01Component,
  ImageCropperExample02Component,
  ImageCropperExample03Component,
  CropperWithDialogComponent,
  CropCircleComponent,
  FullCropperWidthComponent
];

@NgModule({
  imports: [
    CropperBasicUsageModule,
    ImageCropperExample01Module,
    ImageCropperExample02Module,
    ImageCropperExample03Module,
    CropperWithDialogModule,
    CropCircleModule,
    FullCropperWidthModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
