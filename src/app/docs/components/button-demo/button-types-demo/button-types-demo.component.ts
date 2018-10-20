import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  root: {
    '& button': {
      margin: '5px'
    }
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
