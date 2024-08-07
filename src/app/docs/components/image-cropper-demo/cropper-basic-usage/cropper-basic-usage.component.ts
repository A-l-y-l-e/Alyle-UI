import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { StyleRenderer, lyl, ThemeVariables, SelectorsFn } from '@alyle/ui';

import {
  ImgCropperConfig,
  ImgCropperEvent,
  LyImageCropper,
  ImgCropperErrorEvent,
  STYLES as CROPPER_STYLES
} from '@alyle/ui/image-cropper';

const STYLES = (_theme: ThemeVariables, selectors: SelectorsFn) => {
  const cropper = selectors(CROPPER_STYLES);
  return {
    root: lyl `{
      ${cropper.root} {
        aspect-ratio: 3 / 2
        max-width: 600px
      }
    }`,
    cropperResult: lyl `{
      position: relative
      width: 150px
      height: 150px
    }`,
  };
};

@Component({
  selector: 'aui-cropper-basic-usage',
  templateUrl: './cropper-basic-usage.component.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropperBasicUsageComponent {
  $$ = this.sRenderer.renderSheet(STYLES, 'root');
  croppedImage?: string | null = null;
  ready = false;
  @ViewChild(LyImageCropper) readonly cropper!: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 200, // Default `250`
    height: 200, // Default `200`
    fill: '#ff2997', // Default transparent
    type: 'image/png', // Or you can also use `image/jpeg`
    responsiveArea: true,
    // resizableArea: true
  };

  constructor(
    readonly sRenderer: StyleRenderer,
  ) { }

  ngAfterViewInit() { }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    console.log('cropped img: ', e);
  }
  onLoaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onError(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }
}