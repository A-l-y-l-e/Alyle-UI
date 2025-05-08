import { Component } from '@angular/core';

@Component({
  selector: 'aui-select-with-ng-model',
  templateUrl: './select-with-ng-model.component.html',
  standalone: false
})
export class SelectWithNgModelComponent {
  items = Array.from(Array(9).keys());
  selected = 2;
}
