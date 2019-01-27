import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'aui-select-reactive-form',
  templateUrl: './select-reactive-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectReactiveFormComponent {
  selectFormControl = new FormControl('', Validators.required);
  selectFormControlTwo = new FormControl('', Validators.required);
  selectFormControlThree = new FormControl('', Validators.required);
}
