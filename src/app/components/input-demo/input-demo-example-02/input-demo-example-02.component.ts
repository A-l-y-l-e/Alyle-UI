import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'input-demo-example-02',
  templateUrl: './input-demo-example-02.component.html',
  styleUrls: ['./input-demo-example-02.component.css'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class InputDemoExample02Component {
  color: string;
  defaultColor = 'blue';
  year: number;
}
