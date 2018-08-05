import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tabs-example-03',
  templateUrl: './tabs-example-03.component.html',
  styleUrls: ['./tabs-example-03.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsExample03Component implements OnInit {
  selected = new FormControl(0);
  selectedIndex = 0;
  tabsDemo = [
    {
      label: 'label 1'
    },
    {
      label: 'label 2'
    }
  ];
  tabs: any[] = [{}, {}];
  constructor() { }

  addTab() {
    this.tabs.push({});
  }

  action() {
    alert('Hello!');
  }

  ngOnInit() {
  }

}
