import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-basic-field',
  templateUrl: './basic-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicFieldComponent {
  hide = true;
  appearance = new FormControl();
  isDisabled = new FormControl();
  password = new FormControl('pass');
}
