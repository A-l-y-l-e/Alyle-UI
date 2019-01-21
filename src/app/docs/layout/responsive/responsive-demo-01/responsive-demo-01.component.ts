import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

@Component({
  selector: 'responsive-demo-01',
  templateUrl: './responsive-demo-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class ResponsiveDemo01Component {
  queries: {key: string, mediaQuery: string}[] = [];

  constructor(
    theme: LyTheme2
  ) {
    const breakpoints = (theme.variables as ThemeVariables).breakpoints;
    Object.keys(breakpoints).forEach(key => {
      this.queries.push({
        key,
        mediaQuery: breakpoints[key]
      });
    });
  }
}
