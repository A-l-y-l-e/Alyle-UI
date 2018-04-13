import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'bg-color-demo-01',
  templateUrl: './bg-color-demo-01.component.html',
  styleUrls: ['./bg-color-demo-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class BgColorDemo01Component {
  @Input() color = 'accent';
}
