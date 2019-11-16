import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImgResolution, ImgCropperConfig, ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  actions: {
    display: 'flex'
  },
  cropping: {
    maxWidth: '400px',
    height: '300px'
  },
  flex: {
    flex: 1
  }
};

@Component({
  selector: 'image-cropper-example-02',
  templateUrl: './image-cropper-example-02.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperExample02Component {
  classes = this.theme.addStyleSheet(styles);
  croppedImage?: string;
  result: string;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`,
    output: ImgResolution.OriginalImage // Default ImgResolution.Default
  };

  constructor(
    private theme: LyTheme2
  ) { }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    console.log('cropped img: ', e);
  }

}
