import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  root: {
    width: '100%',
    maxWidth: '360px'
  }
});

@Component({
  selector: 'aui-simple-list',
  templateUrl: './simple-list.component.html',
  standalone: false
})
export class SimpleListComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
