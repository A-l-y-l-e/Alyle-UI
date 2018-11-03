import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'aui-basic-checkbox',
  templateUrl: './basic-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicCheckboxComponent {
  isEnable: boolean;
  isDisable = false;

  constructor(
    private _cd: ChangeDetectorRef
  ) { }
  onChange() {
    this.isDisable = true;
    setTimeout(() => {
      this.isDisable = false;
      this._cd.markForCheck();
    }, 500);
  }

}
