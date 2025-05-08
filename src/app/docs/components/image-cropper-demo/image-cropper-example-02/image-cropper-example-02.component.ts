import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ImgResolution, ImgCropperConfig, ImgCropperEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { lyl, StyleRenderer } from '@alyle/ui';

const styles = () => {
  return {
    actions: lyl `{
      display: flex
    }`,
    cropper: lyl `{
      max-width: 400px
      height: 300px
    }`,
    flex: lyl `{
      flex: 1
    }`
  };
};

@Component({
  selector: 'image-cropper-example-02',
  templateUrl: './image-cropper-example-02.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class ImageCropperExample02Component {
  classes = this.sRenderer.renderSheet(styles);
  croppedImage?: string;
  ready: boolean;
  result: string;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`,
    output: ImgResolution.OriginalImage // Default ImgResolution.Default
  };
  @ViewChild(LyImageCropper, { static: true }) readonly cropper: LyImageCropper;

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    console.log('cropped img: ', e);
  }

}
