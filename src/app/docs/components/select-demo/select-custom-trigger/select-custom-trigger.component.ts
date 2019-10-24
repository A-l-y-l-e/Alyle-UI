import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-select-custom-trigger',
  templateUrl: './select-custom-trigger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCustomTriggerComponent {
  fruits = new FormControl();
  fruitList = [
    'Apple',
    'Banana',
    'Cherry',
    'Mango',
    'Orange',
    'Pineapple',
    'Strawberry',
  ];
}
