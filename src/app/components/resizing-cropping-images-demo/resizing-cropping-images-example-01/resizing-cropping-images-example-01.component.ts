import { Observable } from 'rxjs/Rx';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

import { LyResizingCroppingImages, LyResizingCroppingImagesConfig } from 'alyle-ui/resizing-cropping-images';

@Component({
  selector: 'resizing-cropping-images-example-01',
  templateUrl: './resizing-cropping-images-example-01.component.html',
  styleUrls: ['./resizing-cropping-images-example-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ResizingCroppingImagesExample01Component implements AfterViewInit {
  @ViewChild(LyResizingCroppingImages) img: LyResizingCroppingImages;
  result: string;
  myConfig: LyResizingCroppingImagesConfig;
  isNewImg: Observable<boolean>;
  constructor() {
    this.myConfig = {
      width: 150, // Default `250`
      height: 150 // Default `200`
    };
  }

  ngAfterViewInit() {
    this.isNewImg = this.img.img
    .map((state) => !state)
    .do(a => a);
  }

}
