import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'input-demo-example-03',
  templateUrl: './input-demo-example-03.component.html',
  styleUrls: ['./input-demo-example-03.component.css']
})
export class InputDemoExample03Component implements OnInit {
  github = 'A-l-y-l-e/Alyle-UI';
  mobile: string;
  constructor() { }

  ngOnInit() {
  }

}
