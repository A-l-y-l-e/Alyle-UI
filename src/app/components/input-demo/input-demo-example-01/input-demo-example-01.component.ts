import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AUI_VERSION } from 'alyle-ui';

@Component({
  selector: 'input-demo-example-01',
  templateUrl: './input-demo-example-01.component.html',
  styleUrls: ['./input-demo-example-01.component.css']
})
export class InputDemoExample01Component implements OnInit {
  value = 'Alyle UI';
  version: string = AUI_VERSION;

  constructor() { }

  ngOnInit() {
  }

}
