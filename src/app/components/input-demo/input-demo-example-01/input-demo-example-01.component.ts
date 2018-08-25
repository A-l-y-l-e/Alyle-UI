import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'input-demo-example-01',
  templateUrl: './input-demo-example-01.component.html',
  styleUrls: ['./input-demo-example-01.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class InputDemoExample01Component {
  value = 'Alyle UI';
}
