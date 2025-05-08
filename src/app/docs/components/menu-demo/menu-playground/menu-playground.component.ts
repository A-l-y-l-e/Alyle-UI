import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { XPosition, YPosition } from '@alyle/ui';

@Component({
  selector: 'aui-menu-playground',
  templateUrl: './menu-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class MenuPlaygroundComponent implements OnInit {
  openOnHover = false;
  hasBackdrop = true;
  xAnchor: XPosition = XPosition.before;
  yAnchor: YPosition = YPosition.below;
  xAxis: XPosition = XPosition.after;
  yAxis: YPosition = YPosition.below;

  constructor() { }

  ngOnInit(): void {
  }

}
