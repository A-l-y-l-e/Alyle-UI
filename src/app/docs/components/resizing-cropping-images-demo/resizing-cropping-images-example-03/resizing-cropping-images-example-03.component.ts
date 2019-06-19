import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { LyResizingCroppingImages, ImgCropperConfig } from '@alyle/ui/resizing-cropping-images';
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
  selector: 'resizing-cropping-images-example-03',
  templateUrl: './resizing-cropping-images-example-03.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizingCroppingImagesExample03Component {
  classes = this.theme.addStyleSheet(styles);
  croppedImage?: string;
  @ViewChild(LyResizingCroppingImages, { static: false }) img: LyResizingCroppingImages;
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
    private theme: LyTheme2
  ) { }
}
