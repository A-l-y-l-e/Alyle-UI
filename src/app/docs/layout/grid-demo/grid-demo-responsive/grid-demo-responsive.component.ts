import { Component } from '@angular/core';
import { LyTheme2, shadowBuilder } from '@alyle/ui';

const styles = theme => ({
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
  selector: 'grid-demo-responsive',
  templateUrl: './grid-demo-responsive.component.html'
})
export class GridDemoResponsiveComponent {

  classes = this.theme.addStyleSheet(styles, 'grid-demo-responsive');
  constructor(
    private theme: LyTheme2
  ) { }
}
