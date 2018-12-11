import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  content: {
    padding: '2em'
  }
});

@Component({
  selector: 'aui-tabs-placement',
  templateUrl: './tabs-placement.component.html'
})
export class TabsPlacementComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2
  ) { }

}
