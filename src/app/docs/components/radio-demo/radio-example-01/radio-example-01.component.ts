import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'radio-example-01',
  templateUrl: './radio-example-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class RadioExample01Component {
  val: string;
  favoriteColor = '#ff1744';
  list = [
    { value: '#2962ff', name: 'blue' },
    { value: '#ff1744', name: 'red' },
    { value: '#00c853', name: 'green' },
    { value: '#ff6d00', name: 'orange' }
  ];

}
