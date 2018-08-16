import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Platform } from '@alyle/ui';

export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'aui-tabs-with-asynchronously-loading',
  templateUrl: './tabs-with-asynchronously-loading.component.html',
  styleUrls: ['./tabs-with-asynchronously-loading.component.scss']
})
export class TabsWithAsynchronouslyLoadingComponent {
  asyncTabs: Observable<ExampleTab[]>;

  constructor() {
    this.asyncTabs = Observable.create((observer: Observer<ExampleTab[]>) => {
      if (Platform.isBrowser) {
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
