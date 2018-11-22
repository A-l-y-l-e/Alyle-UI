import { Component } from '@angular/core';
import { LyIconService } from '@alyle/ui/icon';

@Component({
  selector: 'aui-icon-with-custom-font',
  styles: [
    `@import url("./assets/fonts/linecons/Linecons.css");`
  ],
  templateUrl: './icon-with-custom-font.component.html'
})
export class IconWithCustomFontComponent {

  constructor(
    iconService: LyIconService
  ) {
    iconService.registerFontClass({
      key: 'li',
      prefix: 'li_'
    });
  }
}
