import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Responsive } from 'alyle-ui/responsive';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'responsive-demo-01',
  templateUrl: './responsive-demo-01.component.html',
  styleUrls: ['./responsive-demo-01.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class ResponsiveDemo01Component implements OnInit, OnDestroy {
  private _subscription: Subscription;
  web: any;
  constructor(public responsive: Responsive) {
    this.web = this.responsive.observe('Web');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
