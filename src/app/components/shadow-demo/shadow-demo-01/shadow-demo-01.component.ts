import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shadow-demo-01',
  templateUrl: './shadow-demo-01.component.html',
  styleUrls: ['./shadow-demo-01.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShadowDemo01Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
