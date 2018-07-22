import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

@Component({
  selector: 'grid-demo-responsive',
  templateUrl: './grid-demo-responsive.component.html',
  styleUrls: ['./grid-demo-responsive.component.scss']
})
export class GridDemoResponsiveComponent implements OnInit {

  classes = {
    item: this.theme.setUpStyle(
      'item-responsive',
      () => (
        `padding: 8px;` +
        `text-align: center;` +
        `background: ${this.theme.config.background.secondary};` +
        `height: 100%;`
      )
    )
  };
  constructor(
    private theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
