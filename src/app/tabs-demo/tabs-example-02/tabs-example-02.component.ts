import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tabs-example-02',
  templateUrl: './tabs-example-02.component.html',
  styleUrls: ['./tabs-example-02.component.css']
})
export class TabsExample02Component implements OnInit {

  tabs: string[] = ['One', 'Two'];

  constructor() { }

  ngOnInit() {
  }

}
