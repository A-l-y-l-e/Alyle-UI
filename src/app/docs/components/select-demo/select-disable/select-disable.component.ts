import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'aui-select-disable',
  templateUrl: './select-disable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class SelectDisableComponent {
  disableSelect = new UntypedFormControl(false);
}
