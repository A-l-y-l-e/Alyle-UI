import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { Responsive, LY_MEDIA_QUERIES } from '@alyle/ui/responsive';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'responsive-demo-01',
  templateUrl: './responsive-demo-01.component.html',
  styleUrls: ['./responsive-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class ResponsiveDemo01Component implements OnDestroy {
  private _subscription: Subscription;
  private queries: {key: string, mediaQuery: string}[] = [];
  constructor(
    @Inject(LY_MEDIA_QUERIES) mediaQueries: { [key: string]: string; },
    public responsive: Responsive
  ) {
    /** Deprecated */
    this._subscription = this.responsive.observe('Web')
    .subscribe((result) => {
      // console.log('Web', result);
    });
    Object.keys(mediaQueries).forEach(key => {
      this.queries.push({
        key,
        mediaQuery: mediaQueries[key]
      });
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
