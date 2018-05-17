import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'flex-demo-one',
  templateUrl: './flex-demo-one.component.html',
  styleUrls: ['./flex-demo-one.component.css']
})
export class FlexDemoOneComponent implements OnInit {
  items = Array.from(Array(3).keys());
  constructor() { }

  ngOnInit() {
  }

}
