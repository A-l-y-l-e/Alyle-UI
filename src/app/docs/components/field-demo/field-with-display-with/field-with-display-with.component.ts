import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'aui-field-with-display-with',
  templateUrl: './field-with-display-with.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class FieldWithDisplayWithComponent {
  readonly price = new UntypedFormControl(14000);
}
