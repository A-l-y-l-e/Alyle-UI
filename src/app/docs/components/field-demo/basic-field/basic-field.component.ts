import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-basic-field',
  templateUrl: './basic-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicFieldComponent {
  val = 'value';
}
