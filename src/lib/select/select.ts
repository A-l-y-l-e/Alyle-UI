import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';

@Component({
  templateUrl: 'select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySelect',
  selector:
      'ly-select:not([multiple])[formControlName],ly-select:not([multiple])[formControl],ly-select:not([multiple])[ngModel]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [SELECT_VALUE_ACCESSOR]
})
export class LySelect extends SelectControlValueAccessor { }
