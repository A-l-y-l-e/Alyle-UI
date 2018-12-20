import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  root: {
    width: '100%',
    maxWidth: '360px'
  }
});

@Component({
  selector: 'aui-inset-dividers',
  templateUrl: './inset-dividers.component.html'
})
export class InsetDividersComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }

}
