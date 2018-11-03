import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'aui-complex-checkbox',
  templateUrl: './complex-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexCheckboxComponent implements OnInit {
  isEnable = false;
  isDisable = false;
  constructor() { }

  ngOnInit() {
  }

}
