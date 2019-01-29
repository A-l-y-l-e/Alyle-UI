import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

export interface Fruit {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'aui-select-option-object-value',
  templateUrl: './select-option-object-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectOptionObjectValueComponent {
  fruits: Fruit[] = [
    { value: 'apple-0', viewValue: 'Apple' },
    { value: 'banana-1', viewValue: 'Banana' },
    { value: 'cherry-2', viewValue: 'Cherry' },
    { value: 'mango-3', viewValue: 'Mango' }
  ];
  fruitControl = new FormControl([
    { value: 'cherry-2', viewValue: 'Cherry' }
  ], [Validators.required]);

  /** For `<ly-select>` */
  valueKeyFn(opt: Fruit) {
    return opt.value;
  }

}
