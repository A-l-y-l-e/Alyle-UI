import { Component, ChangeDetectionStrategy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { StyleRenderer, WithStyles, lyl, ThemeRef } from '@alyle/ui';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import { LyImageCropper, ImgCropperConfig, ImgCropperEvent, ImgCropperErrorEvent } from '@alyle/ui/image-cropper';

const STYLES = (_theme, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  return {
    cropper: lyl `{
      max-width: 320px
      height: 320px
    }`,
    sliderContainer: lyl `{
      position: relative
      ${slider.root} {
        position: absolute
        left: 0
        right: 0
        margin: auto
        top: -32px
      }
    }`,
    slider: lyl `{
      padding: 1em
    }`
  };
};

@Component({
  templateUrl: './cropper-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class CropperDialog implements WithStyles, AfterViewInit {

  readonly classes = this.sRenderer.renderSheet(STYLES);
  scale: number;
  @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    type: 'image/png' // Or you can also use `image/jpeg`
  };

  constructor(
    readonly sRenderer: StyleRenderer,
    public dialogRef: LyDialogRef,
    @Inject(LY_DIALOG_DATA) private event: Event
  ) { }

  ngAfterViewInit() {
    this.cropper.selectInputEvent(this.event);
  }

  onCropped(e: ImgCropperEvent) {
    console.log('cropped img: ', e);
  }
  onloaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onerror(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }

}
