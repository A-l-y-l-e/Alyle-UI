import { Component } from '@angular/core';
import { LyIconService } from '@alyle/ui/icon';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  icon: {
    marginEnd: '.5em'
  },
  iconLarge: {
    fontSize: '48px'
  },
  iconExtraLarge: {
    fontSize: '72px'
  }
});

@Component({
  selector: 'aui-icons',
  templateUrl: './icons.component.html'
})
export class IconsComponent {
  readonly classes = this._theme.addStyleSheet(styles);
  constructor(
    private _theme: LyTheme2,
    icon: LyIconService
  ) {
    // Url SVG icon: ./assets/svg/rocket.svg
    // Do not require extension name
    icon.setSvg('rocket', './assets/svg/rocket');
  }

}
