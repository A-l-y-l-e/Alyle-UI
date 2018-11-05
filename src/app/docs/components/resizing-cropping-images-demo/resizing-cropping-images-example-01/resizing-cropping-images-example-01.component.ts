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
  croppedImage: string;
  result: string;
  myConfig: ImgCropperConfig = {
    autoCrop: true,
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997' // Default transparent if type = png else #000
  };

  constructor(
    private theme: LyTheme2
  ) { }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.base64;
    console.log('cropped img: ', e);
  }
  onloaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onerror(e: ImgCropperEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }

}
