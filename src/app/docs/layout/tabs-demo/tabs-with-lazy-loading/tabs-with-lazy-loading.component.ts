import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-tabs-with-lazy-loading',
  templateUrl: './tabs-with-lazy-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TabsWithLazyLoadingComponent {
  tabLoadTimes: Date[] = [];

  constructor() { }

  getTime(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

}
