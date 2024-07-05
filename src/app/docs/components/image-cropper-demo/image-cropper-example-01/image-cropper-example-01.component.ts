import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { StyleRenderer, lyl, WithStyles, ThemeRef, ThemeVariables } from '@alyle/ui';
import {
  ImgCropperConfig,
  ImgCropperEvent,
  LyImageCropper,
  ImgCropperErrorEvent,
  ImgCropperLoaderConfig,
  STYLES as CROPPER_STYLES
} from '@alyle/ui/image-cropper';
import { Platform } from '@angular/cdk/platform';
import { LySliderChange } from '@alyle/ui/slider';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(CROPPER_STYLES);
  return {
    cropper: lyl `{
      max-width: 400px
      height: 300px
    }`,
    cropperResult: lyl `{
      position: relative
      width: 150px
      height: 150px
    }`,
    sliderContainer: lyl `{
      text-align: center
      max-width: 400px
      margin: 14px
    }`
  };
};

@Component({
  selector: 'image-cropper-example-01',
  templateUrl: './image-cropper-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class ImageCropperExample01Component implements WithStyles, AfterViewInit {
  classes = this.sRenderer.renderSheet(STYLES);
  croppedImage?: string | null = null;
  scale: number;
  ready = false;
  minScale: number;
  @ViewChild(LyImageCropper) readonly cropper!: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997', // Default transparent if type == png else #000
    type: 'image/png', // Or you can also use `image/jpeg`
    responsiveArea: true
  };

  constructor(
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) { }

  ngAfterViewInit() {

    // demo: Load image from URL and update position, scale & rotate
    // this is supported only for browsers
    if (this._platform.isBrowser) {
      const config: ImgCropperLoaderConfig = {
        scale: 0.745864772531767,
        xOrigin: 642.380608078103,
        yOrigin: 236.26357452128866,
        // areaWidth: 100,
        // areaHeight: 100,
        rotation: 0,
        originalDataURL: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Flarm-rmah-47685-unsplash-1.png?alt=media&token=96a29be5-e3ef-4f71-8437-76ac8013372c'
      };
      this.cropper.loadImage(config);
    }

  }

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
  onSliderInput(event: LySliderChange) {
    this.scale = event.value as number;
  }

}
