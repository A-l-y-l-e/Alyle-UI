import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'aui-select-disable',
  templateUrl: './select-disable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDisableComponent {
  disableSelect = new FormControl(false);
}
