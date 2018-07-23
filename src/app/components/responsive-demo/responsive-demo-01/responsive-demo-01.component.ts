import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject } from '@angular/core';
import { LY_MEDIA_QUERIES } from '@alyle/ui/responsive';

@Component({
  selector: 'responsive-demo-01',
  templateUrl: './responsive-demo-01.component.html',
  styleUrls: ['./responsive-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class ResponsiveDemo01Component {
  queries: {key: string, mediaQuery: string}[] = [];

  constructor(
    @Inject(LY_MEDIA_QUERIES) mediaQueries: { [key: string]: string; }
  ) {
    Object.keys(mediaQueries).forEach(key => {
      this.queries.push({
        key,
        mediaQuery: mediaQueries[key]
      });
    });
  }
}
