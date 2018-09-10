import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'radio-example-01',
  templateUrl: './radio-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class RadioExample01Component {
  val: string;
  favoriteColor = 'red';
  list = [
    { value: 'blue' },
    { value: 'red' },
    { value: 'green' },
    { value: 'orange' }
  ];

}
