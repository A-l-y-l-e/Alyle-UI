import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-field-playground',
  templateUrl: './field-playground.component.html'
})
export class FieldPlaygroundComponent {
  hide = true;
  appearance = new FormControl();
  isReadonly = new FormControl();
  isDisabled = new FormControl();
  password = new FormControl('pass');
}
