import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'button-example-03',
  templateUrl: './button-example-03.component.html',
  styleUrls: ['./button-example-03.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonExample03Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
