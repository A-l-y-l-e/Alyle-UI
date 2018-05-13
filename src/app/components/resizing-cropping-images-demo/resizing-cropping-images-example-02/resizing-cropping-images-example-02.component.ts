import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
  } from '@angular/core';
import {
  CroppedImage,
  ImageResolution,
  LyResizingCroppingImages,
  LyResizingCroppingImagesConfig
  } from '@alyle/ui/resizing-cropping-images';

@Component({
  selector: 'resizing-cropping-images-example-02',
  templateUrl: './resizing-cropping-images-example-02.component.html',
  styleUrls: ['./resizing-cropping-images-example-02.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizingCroppingImagesExample02Component {

  @ViewChild(LyResizingCroppingImages) img: LyResizingCroppingImages;
  result: string;
  myConfig: LyResizingCroppingImagesConfig = {
    width: 150, // Default `250`
    height: 150, // Default `200`,
    output: ImageResolution.OriginalImage // Default ImageResolution.Default
  };

  constructor() { }

  crop() {
    const imgCropped: CroppedImage = this.img.crop();
  }

}
