import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { LyResizingCroppingImages, LyResizingCroppingImagesConfig } from '@alyle/ui/resizing-cropping-images';
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
  selector: 'resizing-cropping-images-example-03',
  templateUrl: './resizing-cropping-images-example-03.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizingCroppingImagesExample03Component {
  classes = this.theme.addStyleSheet(styles);
  @ViewChild(LyResizingCroppingImages) img: LyResizingCroppingImages;
  result: string;
  myConfig: LyResizingCroppingImagesConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`,
    output: {
      width: 50,
      height: 50
    }
  };

  constructor(
    private theme: LyTheme2
  ) { }
}
