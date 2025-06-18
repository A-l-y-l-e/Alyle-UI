import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LySliderChange, STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import { ThemeVariables, ThemeRef, lyl, StyleRenderer } from '@alyle/ui';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
  ImgCropperLoaderConfig,
  ImgResolution
} from '@alyle/ui/image-cropper';
import { Platform } from '@angular/cdk/platform';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl `{
      ${cropper.root} {
        max-width: 400px
        height: 320px
      }
      ${slider.root} {
        width: 100%
        max-width: 400px
        padding-left: 1em
        padding-right: 1em
      }
    }`,
    sliderContainer: lyl `{
      text-align: center
      max-width: 400px
      padding: 14px
      box-sizing: border-box
    }`
  };
};

@Component({
  selector: 'aui-full-cropper-width',
  templateUrl: './full-cropper-width.component.html',
  providers: [
    StyleRenderer
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class FullCropperWidthComponent implements AfterViewInit {

  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  croppedImage?: string;
  ready: boolean;
  scale: number;
  minScale: number;
  maxScale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    // 3:1 aspect ratio
    width: 200 * 3,
    height: 200,
    keepAspectRatio: true,
    responsiveArea: true,
    output: ImgResolution.OriginalImage,
  };

  constructor(
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) { }

  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      const config: ImgCropperLoaderConfig = {
        rotation: 0,
        xOrigin: 3235.7749135491986,
        yOrigin: 1711.626216978359,
        scale:   0.11451599999999999,
        originalDataURL: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Ftimothy-dykes-1zwiiaFER8Y-unsplash.jpg?alt=media&token=b4c3611b-8eb5-4add-94b9-8d85e58e334d'
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
