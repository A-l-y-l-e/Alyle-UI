import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = theme => ({
  item: {
    padding: '8px',
    textAlign: 'center',
    background: theme.background.secondary,
    height: '100%'
  }
});

@Component({
  selector: 'grid-demo-responsive',
  templateUrl: './grid-demo-responsive.component.html',
  styleUrls: ['./grid-demo-responsive.component.scss']
})
export class GridDemoResponsiveComponent {

  classes = this.theme.addStyleSheet(styles, 'grid-demo-responsive');
  constructor(
    private theme: LyTheme2
  ) { }
}
