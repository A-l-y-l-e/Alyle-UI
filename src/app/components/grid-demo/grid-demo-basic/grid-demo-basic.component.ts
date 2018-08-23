import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = theme => ({
  item: {
    padding: '8px',
    textAlign: 'center',
    background: theme.background.primary
  }
});

@Component({
  selector: 'grid-demo-basic',
  templateUrl: './grid-demo-basic.component.html',
  styleUrls: ['./grid-demo-basic.component.scss']
})
export class GridDemoBasicComponent {
  classes = this.theme.addStyleSheet(styles, 'grid-demo-basic');
  constructor(
    private theme: LyTheme2
  ) { }
}
