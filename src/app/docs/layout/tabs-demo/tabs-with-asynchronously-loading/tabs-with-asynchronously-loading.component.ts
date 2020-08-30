import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'aui-tabs-with-asynchronously-loading',
  templateUrl: './tabs-with-asynchronously-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsWithAsynchronouslyLoadingComponent {
  asyncTabs: Observable<ExampleTab[]>;

  constructor(
    platform: Platform
  ) {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      if (platform.isBrowser) {
        setTimeout(() => {
          observer.next([
            {label: 'First', content: 'Content 1'},
            {label: 'Second', content: 'Content 2'},
            {label: 'Third', content: 'Content 3'},
          ]);
        }, 3000);
      }
    });
  }
}
