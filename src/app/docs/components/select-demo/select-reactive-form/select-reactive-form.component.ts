import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';


@Component({
  selector: 'aui-select-reactive-form',
  templateUrl: './select-reactive-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SelectReactiveFormComponent {
  selectFormControl = new UntypedFormControl('', Validators.required);
  selectFormControlTwo = new UntypedFormControl('', Validators.required);
  selectFormControlThree = new UntypedFormControl('', Validators.required);
}
