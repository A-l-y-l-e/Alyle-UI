import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'aui-field-playground',
  templateUrl: './field-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldPlaygroundComponent {
  hide = true;
  appearance = new FormControl();
  isReadonly = new FormControl();
  isDisabled = new FormControl();
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
}
