import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogWithSelectDialog } from './dialog-with-select-dialog';

@Component({
  selector: 'aui-dialog-with-select',
  templateUrl: './dialog-with-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogWithSelectComponent {
  constructor(
    private _dialog: LyDialog
  ) { }

  open() {
    const dialogRef = this._dialog.open<DialogWithSelectDialog>(DialogWithSelectDialog, {
      width: 320
    });
    dialogRef.afterClosed.subscribe((result) => console.log(result));
  }
}
