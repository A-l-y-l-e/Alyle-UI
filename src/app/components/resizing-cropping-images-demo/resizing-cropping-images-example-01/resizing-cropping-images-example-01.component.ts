import { Component, OnInit, ViewChild } from '@angular/core';

import { ResizingCroppingImagesComponent as ResizingCroppingImages } from 'alyle-ui/resizing-cropping-images';

@Component({
  selector: 'resizing-cropping-images-example-01',
  templateUrl: './resizing-cropping-images-example-01.component.html',
  styleUrls: ['./resizing-cropping-images-example-01.component.css']
})
export class ResizingCroppingImagesExample01Component implements OnInit {
  @ViewChild(ResizingCroppingImages) img: ResizingCroppingImages;

  constructor() { }

  imgCrop() {
    console.log(this.img.imgCrop);
  }

  ngOnInit() {
  }

}
