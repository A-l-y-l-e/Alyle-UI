import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = ({
  carousel: {
    maxWidth: '360px',
    height: '220px',
    margin: 'auto'
  },
  carouselItem: {
    textAlign: 'center'
  }
});

@Component({
  selector: 'aui-carousel-with-gestures',
  templateUrl: './carousel-with-gestures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselWithGesturesComponent {

  readonly classes = this.theme.addStyleSheet(STYLES);
  items = [
    {
      title: 'Mountains',
      img: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2F' +
      'Mountains-Blue.jpg?alt=media&token=d04f0279-79c6-4752-8b5a-cccd73720243'
    },
    {
      title: 'Four Lakes, Queshuachaca',
      img: 'https://firebasestorage.googleapis.com/v0/b/head-expeditions.appspot.com/o/img%2F' +
      'files%2F61028703-1476458588-5a289afc-59e8-4a8d-1dea-369e-570b-cfb2.jpg?alt=media&token=ceaf31b5-2b87-438b-b0d1-e4cc4f8603a2'
    },
    {
      title: 'Mountains',
      img: 'https://firebasestorage.googleapis.com/v0/b/alyle-ui.appspot.com/o/img%2F' +
          'mads-schmidt-rasmussen-567063-unsplash.jpg?alt=media&token=5acdfbb2-7eff-4879-b7d0-a441826d88ae'
    }
  ];

  constructor(private theme: LyTheme2) { }

}
