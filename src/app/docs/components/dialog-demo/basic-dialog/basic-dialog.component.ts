import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog, LyDialogRef } from '@alyle/ui/dialog';

@Component({
  selector: 'aui-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BasicDialogComponent {

  constructor(
    private _dialog: LyDialog
  ) { }

  open() {
    const dialogRef = this._dialog.open<DialogDemo>(DialogDemo, {
      width: 320
    });
    dialogRef.afterClosed.subscribe((result) => console.log(result));
  }

}

@Component({
  templateUrl: './dialog-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DialogDemo {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
