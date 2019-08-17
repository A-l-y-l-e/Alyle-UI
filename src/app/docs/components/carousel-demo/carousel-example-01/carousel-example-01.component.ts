import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  carousel: {
    margin: 'auto',
    // responsive
    maxWidth: '540px',
    height: '50vh',
    minHeight: '220px',
    maxHeight: '320px'
  },
  carouselItem: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
    padding: '1em 1em 48px',
    boxSizing: 'border-box',
    color: '#fff',
    '&:nth-child(3)': {
      color: '#2b2b2b'
    }
  }
});

@Component({
  selector: 'carousel-example-01',
  templateUrl: './carousel-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class CarouselExample01Component {

  readonly classes = this.theme.addStyleSheet(styles);
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

  constructor(
    private theme: LyTheme2
  ) { }
}
