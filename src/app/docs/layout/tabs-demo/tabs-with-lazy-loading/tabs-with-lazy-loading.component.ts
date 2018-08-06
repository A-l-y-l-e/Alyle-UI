import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-tabs-with-lazy-loading',
  templateUrl: './tabs-with-lazy-loading.component.html',
  styleUrls: ['./tabs-with-lazy-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsWithLazyLoadingComponent {
  tabLoadTimes: Date[] = [];
  getTime(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

}
