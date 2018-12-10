import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { LyTheme2 } from '@alyle/ui';

const styles = ({
  form: {
    maxWidth: '320px',
    margin: '0 auto',
    'ly-checkbox': {
      padding: '8px 0'
    }
  }
});

export interface Fruit {
  name: string;
  disabled?: boolean;
}


@Component({
  selector: 'aui-complex-checkbox',
  templateUrl: './complex-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexCheckboxComponent {
  readonly classes = this.theme.addStyleSheet(styles);
  fruits: Fruit[] = [
    { name: 'Apple' },
    { name: 'Banana', disabled: true },
    { name: 'Cherry' },
    { name: 'Mango', disabled: true },
    { name: 'Orange' },
    { name: 'Pineapple' },
    { name: 'Strawberry' }
  ];
  form: FormGroup = new FormGroup({
    fruits: new FormArray(
      this.fruits
      .map((val) => new FormControl({
        value: Math.floor(Math.random() * 11) > 5,
        disabled: val.disabled
      }))
    )
  });
  fruitsAbstractControlArray: AbstractControl[] = (<FormArray>this.form.get('fruits')).controls;

  get selectedFruits() {
    const fruits = this.fruits.filter(_ => !_.disabled);
    if (fruits.length === 0) {
      return [];
    }
    return this.form.value.fruits
        .map((bool, index) => bool ? fruits[index].name : null)
        .filter(bool => bool !== null);
  }

  constructor(
    private theme: LyTheme2
  ) { }

  onDisableChange(fruitControl: FormControl, checked: boolean, index: number) {
    const fruits = this.fruits;
    fruits[index].disabled = checked;
    if (checked) {
      fruitControl.disable();
    } else {
      fruitControl.enable();
    }
  }

}
