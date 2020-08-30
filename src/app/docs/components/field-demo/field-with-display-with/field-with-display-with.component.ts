import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-field-with-display-with',
  templateUrl: './field-with-display-with.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldWithDisplayWithComponent {
  readonly price = new FormControl(14000);
}
