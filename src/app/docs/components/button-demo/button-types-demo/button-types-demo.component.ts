import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = () => ({
  root: {
    button: {
      marginAfter: '1em',
      marginTop: '.5em',
      marginBottom: '.5em'
    }
  },
  row: {
    display: 'flex',
    marginBottom: '.5em',
    alignItems: 'center'
  }
});

@Component({
  selector: 'aui-button-types-demo',
  templateUrl: './button-types-demo.component.html'
})
export class ButtonTypesDemoComponent {
  classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
 }
