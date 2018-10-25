import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ImgCropperConfig, ImgCropperEvent } from '@alyle/ui/resizing-cropping-images';
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
  selector: 'resizing-cropping-images-example-01',
  templateUrl: './resizing-cropping-images-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ResizingCroppingImagesExample01Component {
  classes = this.theme.addStyleSheet(styles);
  result: string;
  myConfig: ImgCropperConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997' // Default transparent if type = png else #000
  };

  constructor(
    private theme: LyTheme2
  ) { }

  onCropped(e: ImgCropperEvent) {
    console.log('cropped img: ', e);
  }
  onloaded() {
    console.log('img loaded');
  }
  onerror(e: ImgCropperEvent) {
    console.warn(`the '${e.name}' is not a valid image`, e);
  }

}
