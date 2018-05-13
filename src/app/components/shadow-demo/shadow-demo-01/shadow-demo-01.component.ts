import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shadow-demo-01',
  templateUrl: './shadow-demo-01.component.html',
  styleUrls: ['./shadow-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ShadowDemo01Component implements OnInit {
  elevations = Array.from(Array(25).keys());
  constructor() { }

  ngOnInit() {
  }

}
