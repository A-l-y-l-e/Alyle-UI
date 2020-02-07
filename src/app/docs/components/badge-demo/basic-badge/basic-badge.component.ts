import { Component } from '@angular/core';
import { LyTheme2, lyl } from '@alyle/ui';

const styles = () => {

  return {
    root: lyl `{
      & [ly-button] {
        margin: 1em
      }
    }`,
    padding: lyl `{
      padding: 0 1em
    }`
  };
};

@Component({
  selector: 'aui-basic-badge',
  templateUrl: './basic-badge.component.html'
})
export class BasicBadgeComponent {
  classes = this._theme.addStyleSheet(styles);

  constructor(private _theme: LyTheme2) { }
}
