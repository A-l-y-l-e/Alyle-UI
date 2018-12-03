import { Component } from '@angular/core';
import { ThemeVariables, LyTheme2 } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => {
  const mediaStyles = {
    color: theme.primary.contrast,
    backgroundColor: theme.primary.default
  };
  return {
    box: {
      backgroundColor: theme.background.primary.default,
      minWidth: '110px',
      display: 'inline-flex',
      minHeight: '110px',
      padding: '1em',
      fontSize: '14px',
      textAlign: 'center',
      wordBreak: 'break-all',
      alignItems: 'center',
      justifyContent: 'center',
    },
    demo1: {
      [theme.getBreakpoint('XSmall')]: mediaStyles
    },
    demo2: {
      [theme.getBreakpoint('Small')]: mediaStyles
    },
    demo3: {
      [theme.getBreakpoint('Medium')]: mediaStyles
    },
    demo4: {
      [theme.getBreakpoint('Large')]: mediaStyles
    },
    demo5: {
      [theme.getBreakpoint('XLarge')]: mediaStyles
    },
    demo6: {
      [theme.getBreakpoint('Handset')]: mediaStyles
    },
    demo7: {
      [theme.getBreakpoint('Tablet')]: mediaStyles
    },
    demo8: {
      [theme.getBreakpoint('Web')]: mediaStyles
    }
  };
};

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
