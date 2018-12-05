import { Component } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  root: {
    '& [ly-button]': {
      margin: '1em'
    }
  },
  padding: {
    padding: '0 1em'
  },
  customBadge: {
    after: 0,
    above: 0,
    bottom: 0,
    margin: 'auto 0',
    border: `2px solid ${theme.background.tertiary}`
  }
});

@Component({
  selector: 'aui-basic-badge',
  templateUrl: './basic-badge.component.html'
})
export class BasicBadgeComponent {
  classes = this._theme.addStyleSheet(styles);

  constructor(private _theme: LyTheme2) { }
}
