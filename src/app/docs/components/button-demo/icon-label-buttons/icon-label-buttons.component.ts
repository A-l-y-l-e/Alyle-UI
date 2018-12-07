import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = () => ({
  button: {
    margin: '1em'
  },
  labelBefore: {
    paddingAfter: '8px'
  },
  labelAfter: {
    paddingBefore: '8px'
  },
  iconSmall: {
    fontSize: '20px'
  }
});

@Component({
  selector: 'aui-icon-label-buttons',
  templateUrl: './icon-label-buttons.component.html'
})
export class IconLabelButtonsComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);
  constructor(
    private _theme: LyTheme2
  ) { }
}
