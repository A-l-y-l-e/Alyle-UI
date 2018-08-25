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
