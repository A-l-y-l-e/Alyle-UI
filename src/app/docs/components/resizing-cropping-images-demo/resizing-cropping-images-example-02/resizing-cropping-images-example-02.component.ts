import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImgResolution, ImgCropperConfig } from '@alyle/ui/resizing-cropping-images';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cropping: {
    maxWidth: '400px',
    height: '300px'
  }
};

@Component({
  selector: 'resizing-cropping-images-example-02',
  templateUrl: './resizing-cropping-images-example-02.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizingCroppingImagesExample02Component {
  classes = this.theme.addStyleSheet(styles);
  result: string;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`,
    output: ImgResolution.OriginalImage // Default ImgResolution.Default
  };

  constructor(
    private theme: LyTheme2
  ) { }

  onCropped(e) {
    console.log('cropped img: ', e);
  }

}
