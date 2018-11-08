import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';



export interface Fruits {
  id: number;
  name: string;
}

@Component({
  selector: 'aui-complex-checkbox',
  templateUrl: './complex-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexCheckboxComponent {
  fruits: Fruits[] = [
    { id: 0, name: 'Apple' },
    { id: 1, name: 'Banana' },
    { id: 2, name: 'Cherry' },
    { id: 3, name: 'Mango' },
    { id: 5, name: 'Orange' },
    { id: 6, name: 'Pineapple' },
    { id: 7, name: 'Strawberry' }
  ];
  form: FormGroup = new FormGroup({
    fruits: new FormArray(
      this.fruits.map(() => new FormControl(Math.floor(Math.random() * 11) > 5))
    )
  });
  get selectedFruits() {
    const fruits: boolean[] = this.form.value.fruits;
    return fruits.map((bool, index) => bool ? this.fruits[index].name : null).filter(bool => bool !== null);
  }

}
