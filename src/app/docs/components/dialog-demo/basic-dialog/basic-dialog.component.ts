import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog, LyDialogRef } from '@alyle/ui/dialog';

@Component({
  selector: 'aui-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogComponent {

  constructor(
    private _dialog: LyDialog
  ) { }

  open() {
    const dialogRef = this._dialog.open<DialogDemo>(DialogDemo, {
      width: 320
    });
    dialogRef.beforeClosed.subscribe((result) => console.log(result));
  }

}

@Component({
  templateUrl: './dialog-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogDemo {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
