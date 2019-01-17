import { Component, ChangeDetectionStrategy, forwardRef, StaticProvider, Renderer2, ElementRef } from '@angular/core';
import { SelectControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const SELECT_VALUE_ACCESSOR: StaticProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};

@Component({
  selector:
      'ly-select:not([multiple]),ly-select:not([multiple]),[formControlName],ly-select:not([multiple])[formControl],ly-select:not([multiple])[ngModel]',
  templateUrl: 'select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'lySelect',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [SELECT_VALUE_ACCESSOR]
})
export class LySelect extends SelectControlValueAccessor {
  constructor(_renderer: Renderer2,
              _el: ElementRef) {
    super(_renderer, _el);
  }
}
