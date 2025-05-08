import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = () => ({
  tabs: {
    maxWidth: '540px'
  },
  labelAfter: {
    paddingBefore: '8px'
  }
});

@Component({
  selector: 'aui-tabs-with-icon',
  templateUrl: './tabs-with-icon.component.html',
  standalone: false
})
export class TabsWithIconComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
