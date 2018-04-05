import { Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LyResizingCroppingImages, LyResizingCroppingImagesConfig, ImageResolution, CroppedImage } from 'alyle-ui/resizing-cropping-images';

@Component({
  selector: 'resizing-cropping-images-example-03',
  templateUrl: './resizing-cropping-images-example-03.component.html',
  styleUrls: ['./resizing-cropping-images-example-03.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizingCroppingImagesExample03Component {

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

  constructor() { }

  crop() {
    const imgCropped: CroppedImage = this.img.crop();
  }

}
