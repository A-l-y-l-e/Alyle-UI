import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

/**
 * Basic style
 * @param theme Theme config
 */
const styles = (theme: ThemeVariables) => ({
  root: {                         // this would be like the name of the class
    color: theme.primary.default, // style
    '&:hover': {                  // `&`is equal to `root` and therefore it would be 'root:hover'
      color: theme.accent.default // style
    }
  },
  buttonLink: {
    color: theme.primary.default,
    textDecoration: 'inherit',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

@Component({
  selector: 'aui-ds-basic',
  templateUrl: './ds-basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsBasicComponent {
  classes = this.theme.addStyleSheet(styles);

  constructor(
    private theme: LyTheme2
  ) { }

}
