import { Component } from '@angular/core';
import { ThemeVariables, LyTheme2 } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => ({
  demo1: {
    display: 'none',
    [theme.getBreakpoint('XSmall')]: {
      color: theme.primary.default,
      display: 'block'
    }
  },
  demo2: {
    display: 'none',
    [theme.getBreakpoint('Small')]: {
      color: theme.accent.default,
      display: 'block'
    }
  },
  demo3: {
    display: 'none',
    [theme.getBreakpoint('Medium')]: {
      color: theme.warn.default,
      display: 'block'
    }
  },
  demo4: {
    display: 'none',
    [theme.getBreakpoint('Large')]: {
      color: theme.warn.default,
      display: 'block'
    }
  }
});

@Component({
  selector: 'aui-responsive-with-ds',
  templateUrl: './responsive-with-ds.component.html'
})
export class ResponsiveWithDsComponent {
  classes = this.theme.addStyleSheet(STYLES);
  constructor(
    private theme: LyTheme2
  ) { }
}
