import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'aui-select-custom-trigger',
  templateUrl: './select-custom-trigger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SelectCustomTriggerComponent {
  fruits = new UntypedFormControl();
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
