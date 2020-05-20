import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { StyleRenderer, lyl, WithStyles } from '@alyle/ui';
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper, ImgCropperErrorEvent } from '@alyle/ui/image-cropper';
import { Platform } from '@angular/cdk/platform';

const STYLES = () => ({
  cropper: lyl `{
    max-width: 400px
    height: 300px
  }`,
  sliderContainer: lyl `{
    text-align: center
    max-width: 400px
    margin: 14px
  }`
});

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
  croppedImage?: string;
  scale: number;
  @ViewChild(LyImageCropper) cropper: LyImageCropper;
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
          xOrigin: 642.380608078103,
          yOrigin: 236.26357452128866
        }
      };
      this.cropper.setImageUrl(
        'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Flarm-rmah-47685-unsplash-1.png?alt=media&token=96a29be5-e3ef-4f71-8437-76ac8013372c',
        () => {
          this.cropper.setScale(config.scale, true);
          this.cropper.updatePosition(config.position.xOrigin, config.position.yOrigin);
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
