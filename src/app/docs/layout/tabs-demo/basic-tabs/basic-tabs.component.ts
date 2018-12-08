import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  content: {
    padding: '2em'
  }
});

@Component({
  selector: 'aui-basic-tabs',
  templateUrl: './basic-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicTabsComponent {
  classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }
}
