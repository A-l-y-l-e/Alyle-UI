import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-basic-field',
  templateUrl: './basic-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicFieldComponent {
  val = 'value';
  appearance = new FormControl();
}
