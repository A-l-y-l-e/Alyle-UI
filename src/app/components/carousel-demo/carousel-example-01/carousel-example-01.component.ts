import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'carousel-example-01',
  templateUrl: './carousel-example-01.component.html',
  styleUrls: ['./carousel-example-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class CarouselExample01Component implements OnInit {
  items: any[] = [
    {
      title: 'Mountains',
      img: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2FMountains-Blue.jpg?alt=media&token=d04f0279-79c6-4752-8b5a-cccd73720243'
    },
    {
      title: 'Four Lakes, Queshuachaca',
      // tslint:disable-next-line:max-line-length
      img: 'https://firebasestorage.googleapis.com/v0/b/head-expeditions.appspot.com/o/img%2Ffiles%2F61028703-1476458588-5a289afc-59e8-4a8d-1dea-369e-570b-cfb2.jpg?alt=media&token=ceaf31b5-2b87-438b-b0d1-e4cc4f8603a2'
    },
    {
      title: 'Flowers',
      img: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2Fprv4.jpg?alt=media&token=b89d963c-18f0-4911-a643-fce82dc64b99'
    }
  ];

  constructor() { }

  ngOnInit() {

  }

}
