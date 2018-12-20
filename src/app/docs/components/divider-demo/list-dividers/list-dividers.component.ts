import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  root: {
    width: '100%',
    maxWidth: '360px'
  }
});

@Component({
  selector: 'aui-list-dividers',
  templateUrl: './list-dividers.component.html'
})
export class ListDividersComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
