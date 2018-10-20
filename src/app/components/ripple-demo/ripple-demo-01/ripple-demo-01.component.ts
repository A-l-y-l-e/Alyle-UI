import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = {
  ripple: {
    display: 'inline-block',
    boxShadow: '0px 0px 2px rgba(5, 29, 99, 0.1)',
    cursor: 'default',
    userSelect: 'none',
    margin: '1em',
    padding: 'calc(1em / 2)',
    overflow: 'hidden',
    maxWidth: '500px',
    outline: 'none',
    position: 'relative',
  }
};

@Component({
  selector: 'ripple-demo-01',
  templateUrl: './ripple-demo-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class RippleDemo01Component {
  classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2,
  ) { }

}
