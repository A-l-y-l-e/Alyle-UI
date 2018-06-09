import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';

import { LyResizingCroppingImages, LyResizingCroppingImagesConfig, CroppedImage } from '@alyle/ui/resizing-cropping-images';

@Component({
  selector: 'resizing-cropping-images-example-01',
  templateUrl: './resizing-cropping-images-example-01.component.html',
  styleUrls: ['./resizing-cropping-images-example-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ResizingCroppingImagesExample01Component {
  @ViewChild(LyResizingCroppingImages) img: LyResizingCroppingImages;
  result: string;
  myConfig: LyResizingCroppingImagesConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`
    fill: '#ff2997'
  };

  constructor() { }

  crop() {
    const imgCropped: CroppedImage = this.img.crop();
  }

  oncropped(e) {
    console.log('cropped', e);
  }
  onloaded() {
    console.log('img loaded');
  }
  onerror() {
    console.warn('img not loaded');
  }

}
