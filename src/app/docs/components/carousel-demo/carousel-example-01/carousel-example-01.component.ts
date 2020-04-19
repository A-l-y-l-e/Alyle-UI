import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StyleRenderer, lyl } from '@alyle/ui';

const STYLES = () => {
  return {
    carousel: () => lyl `{
      margin: auto
      // responsive
      max-width: 540px
      height: 50vh
      min-height: 220px
      max-height: 320px
    }`,
    carouselItem: () => lyl `{
      display: flex
      text-align: center
      justify-content: flex-end
      align-items: center
      height: 100%
      flex-direction: column
      padding: 1em 1em 48px
      box-sizing: border-box
      color: #fff
      &:nth-child(3) {
        color: #2b2b2b
      }
    }`
  };
};

@Component({
  selector: 'carousel-example-01',
  templateUrl: './carousel-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    StyleRenderer
  ]
})
export class CarouselExample01Component {

  readonly classes = this.sRenderer.renderSheet(STYLES);
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
    private sRenderer: StyleRenderer
  ) { }
}
