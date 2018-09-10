import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  item: {
    width: '100px',
    height: '100px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.5em',
    fontSize: '14px',
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    padding: '1em'
  }
};

@Component({
  selector: 'shadow-demo-01',
  templateUrl: './shadow-demo-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ShadowDemo01Component {
  classes = this.theme.addStyleSheet(styles, 'shadow-demo-01', 1); // with 1 of priority
  elevations = Array.from(Array(25).keys());
  constructor(
    private theme: LyTheme2
  ) { }

}
