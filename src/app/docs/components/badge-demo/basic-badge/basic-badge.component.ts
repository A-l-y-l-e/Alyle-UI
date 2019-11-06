import { Component } from '@angular/core';
import { LyTheme2, ThemeVariables, lyl } from '@alyle/ui';

const styles = (theme: ThemeVariables) => {
  const { after } = theme;

  return {
    root: lyl `{
      & [ly-button] {
        margin: 1em
      }
    }`,
    padding: lyl `{
      padding: 0 1em
    }`,
    customBadge: lyl `{
      top: 25%
      ${after}: 25%
      margin: auto 0
      border: 2px solid ${theme.background.tertiary}
      min-width: 20px
      height: 20px
      padding: 0 4px
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
