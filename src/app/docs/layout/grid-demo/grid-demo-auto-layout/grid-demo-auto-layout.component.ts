import { Component } from '@angular/core';
import { shadowBuilder, LyTheme2 } from '@alyle/ui';

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
  selector: 'aui-grid-demo-auto-layout',
  templateUrl: './grid-demo-auto-layout.component.html'
})
export class GridDemoAutoLayoutComponent {
  classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
