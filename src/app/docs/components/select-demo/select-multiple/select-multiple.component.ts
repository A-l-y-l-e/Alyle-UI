import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-select-multiple',
  templateUrl: './select-multiple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectMultipleComponent {
  items = Array.from(Array(25).keys());
  selecteds = [2, 4];
}
