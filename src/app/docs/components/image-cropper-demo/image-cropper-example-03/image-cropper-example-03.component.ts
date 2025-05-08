import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { LyImageCropper, ImgCropperConfig } from '@alyle/ui/image-cropper';
import { StyleRenderer, lyl } from '@alyle/ui';

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
  selector: 'image-cropper-example-03',
  templateUrl: './image-cropper-example-03.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ],
  standalone: false
})
export class ImageCropperExample03Component {
  classes = this.sRenderer.renderSheet(styles);
  croppedImage?: string;
  ready: boolean;
  @ViewChild(LyImageCropper, { static: true }) readonly cropper: LyImageCropper;
  result: string;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`,
    output: {
      width: 40,
      height: 40
    }
  };

  onCropped(e) {
    this.croppedImage = e.dataURL;
    console.log(e);
  }

  constructor(
    readonly sRenderer: StyleRenderer
  ) { }
}
