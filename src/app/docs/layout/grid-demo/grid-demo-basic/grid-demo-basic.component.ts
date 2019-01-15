import { Component } from '@angular/core';
import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';

const styles = (theme: ThemeVariables) => ({
  item: {
    padding: '16px',
    textAlign: 'center',
    background: theme.background.secondary,
    boxShadow: shadowBuilder(1),
    borderRadius: '4px',
    height: '100%'
  }
});

@Component({
  selector: 'grid-demo-basic',
  templateUrl: './grid-demo-basic.component.html'
})
export class GridDemoBasicComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
