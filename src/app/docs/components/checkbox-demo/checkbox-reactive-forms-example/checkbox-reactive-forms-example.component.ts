import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface Fruit {
  id: string;
  name: string;
}

@Component({
  selector: 'aui-checkbox-reactive-forms-example',
  templateUrl: './checkbox-reactive-forms-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CheckboxReactiveFormsExampleComponent {
  readonly fruits: Fruit[] = [
    { id: 'f-1', name: 'Apple' },
    { id: 'f-2', name: 'Banana' },
    { id: 'f-3', name: 'Cherry' },
    { id: 'f-4', name: 'Mango' },
    { id: 'f-5', name: 'Orange' },
    { id: 'f-6', name: 'Pineapple' },
    { id: 'f-7', name: 'Strawberry' }
  ];
  readonly myForm = new UntypedFormGroup({
    options: new UntypedFormArray(this.fruits
      .map(() => new UntypedFormControl(false)), minCheckboxesValidator(1))
  });
  allChecked = false;
  indeterminate = false;
  result: null | {options: Fruit[]} = null;

  get options() {
    return this.myForm.get('options') as UntypedFormArray;
  }

  private _updateIndeterminate() {
    this.indeterminate = !this.allChecked && (this.options.value as boolean[]).some(t => t);
  }

  setAll(completed: boolean) {
    this.allChecked = completed;
    this.options.controls.forEach(control => control.setValue(completed));
    this._updateIndeterminate();
  }

  updateAllCheckboxes() {
    this.allChecked = (this.options.value as boolean[]).every(t => t);
    this._updateIndeterminate();
  }

  onSubmit() {
    const options = this.fruits
      .map((fruit, index) => (this.options.value as boolean[])[index] ? ({
        id: fruit.id,
        name: fruit.name
      }) : null)
      .filter(((value): value is Fruit => !!value));
    this.result = {
      options
    };
  }

}

export function minCheckboxesValidator(min: number): ValidatorFn {
  return (arr: UntypedFormArray): ValidationErrors | null => {
    const actual = arr.controls.filter(control => control.value).length;
    return actual < min
      ? { minCheckboxes: {
        minCheckboxes: min,
        actual
      } }
      : null;
  };
}
