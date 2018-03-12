import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tabs-example-01',
  templateUrl: './tabs-example-01.component.html',
  styleUrls: ['./tabs-example-01.component.css']
})
export class TabsExample01Component implements OnInit {

  tabs: string[];

  constructor() { this.tabs = ['One', 'Two']; }

  ngOnInit() {
  }

}
