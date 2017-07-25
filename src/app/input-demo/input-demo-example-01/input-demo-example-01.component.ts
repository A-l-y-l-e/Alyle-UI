import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'input-demo-example-01',
  templateUrl: './input-demo-example-01.component.html',
  styleUrls: ['./input-demo-example-01.component.css']
})
export class InputDemoExample01Component implements OnInit {
  value = 'Alyle UI';
  constructor() { }

  ngOnInit() {
  }

}
