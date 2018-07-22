import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

@Component({
  selector: 'grid-demo-basic',
  templateUrl: './grid-demo-basic.component.html',
  styleUrls: ['./grid-demo-basic.component.scss']
})
export class GridDemoBasicComponent implements OnInit {
  classes = {
    item: this.theme.setUpStyle(
      'item',
      () => (
        `padding: 8px;` +
        `text-align: center;` +
        `background: ${this.theme.config.background.primary}`
      )
    )
  };
  constructor(
    private theme: LyTheme2
  ) { }

  ngOnInit() {
  }

}
