import { Component, ChangeDetectionStrategy } from '@angular/core';

import { LyResizingCroppingImagesConfig } from '@alyle/ui/resizing-cropping-images';
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
  selector: 'resizing-cropping-images-example-01',
  templateUrl: './resizing-cropping-images-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ResizingCroppingImagesExample01Component {
  classes = this.theme.addStyleSheet(styles, 'resizing-cropping-images-example-01');
  result: string;
  myConfig: LyResizingCroppingImagesConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997' // Default transparent if type = png else #000
  };

  constructor(
    private theme: LyTheme2
  ) { }

  onCropped(e) {
    console.log('cropped img: ', e);
  }
  onloaded() {
    console.log('img loaded');
  }
  onerror() {
    console.warn('img not loaded');
  }

}
