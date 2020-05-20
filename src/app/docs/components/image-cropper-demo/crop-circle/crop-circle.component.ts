import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { lyl, WithStyles, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import {
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
  STYLES as CROPPER_STYLES
} from '@alyle/ui/image-cropper';
import { Platform } from '@angular/cdk/platform';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {

  ref.renderStyleSheet(CROPPER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);
  return {
    cropper: lyl `{
      max-width: 400px
      height: 300px
    }`,
    sliderContainer: lyl `{
      text-align: center
      max-width: 400px
      margin: 14px
    }`,
    cropCircle: lyl `{
      ${cropper.area}, ${cropper.area}::after {
        border-radius: 50%
      }
    }`,
    cropResult: lyl `{
      border-radius: 50%
    }`
  };
};

@Component({
  selector: 'aui-crop-circle',
  templateUrl: './crop-circle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropCircleComponent implements WithStyles, AfterViewInit {
  classes = this.sRenderer.renderSheet(STYLES);
  croppedImage?: string;
  scale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    // autoCrop: true,
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997', // Default transparent if type = png else #000
    type: 'image/png' // Or you can also use `image/jpeg`
  };

  constructor(
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) { }

  ngAfterViewInit() {

    // demo: Load image from URL and update position, scale, rotate
    // this is supported only for browsers
    if (this._platform.isBrowser) {
      const config = {
        scale: 0.745864772531767,
        position: {
          x: 642.380608078103,
          y: 236.26357452128866
        }
      };
      this.cropper.setImageUrl(
        'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Flarm-rmah-47685-unsplash-1.png?alt=media&token=96a29be5-e3ef-4f71-8437-76ac8013372c',
        () => {
          this.cropper.setScale(config.scale, true);
          this.cropper.updatePosition(config.position.x, config.position.y);
          // You can also rotate the image
          // this.cropper.rotate(90);
        }
      );
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
}
