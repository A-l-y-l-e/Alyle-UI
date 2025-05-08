import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';

import {
  ImgCropperConfig,
  ImgCropperEvent,
  LyImageCropperBase,
  ImgCropperErrorEvent,
} from '@alyle/ui/image-cropper';

@Component({
  selector: 'aui-cropper-basic-usage',
  templateUrl: './cropper-basic-usage.component.html',
  styles: `
    .ly-cropper-root {
      aspect-ratio: 3 / 2;
      max-width: 600px
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CropperBasicUsageComponent {
  croppedImage?: string | null = null;
  ready = false;
  @ViewChild(LyImageCropperBase) readonly cropper!: LyImageCropperBase;
  cropperConfig: ImgCropperConfig = {
    width: 200, // Default `250`
    height: 200, // Default `200`
    fill: '#ff2997', // Default transparent
    type: 'image/png', // Or you can also use `image/jpeg`
    responsiveArea: true,
    // resizableArea: true
  };

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    console.log('cropped img: ', e);
  }
  onLoaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onError(e: ImgCropperErrorEvent) {
    console.log(e);
    console.warn(`'${e.name}' is not a valid image`, e);
  }
}
