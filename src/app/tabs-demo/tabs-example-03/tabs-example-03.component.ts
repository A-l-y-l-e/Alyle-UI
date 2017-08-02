import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tabs-example-03',
  templateUrl: './tabs-example-03.component.html',
  styleUrls: ['./tabs-example-03.component.css']
})
export class TabsExample03Component implements OnInit {
  selectedIndex: number = 0;
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
