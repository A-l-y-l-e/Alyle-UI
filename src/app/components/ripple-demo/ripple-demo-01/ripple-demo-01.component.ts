import { Component, OnInit, ChangeDetectionStrategy, NgZone } from '@angular/core';

@Component({
  selector: 'ripple-demo-01',
  templateUrl: './ripple-demo-01.component.html',
  styleUrls: ['./ripple-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class RippleDemo01Component implements OnInit {
  state: any;
  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit() { }

  log(event) {
    this.ngZone.run(() => this.state = event);
  }

}
