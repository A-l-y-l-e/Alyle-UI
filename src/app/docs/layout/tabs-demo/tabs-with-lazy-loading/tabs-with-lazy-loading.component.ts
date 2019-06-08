import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  content: {
    padding: '2em'
  }
});

@Component({
  selector: 'aui-tabs-with-lazy-loading',
  templateUrl: './tabs-with-lazy-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsWithLazyLoadingComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  tabLoadTimes: Date[] = [];

  constructor(
    private theme: LyTheme2
  ) { }

  getTime(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

}
