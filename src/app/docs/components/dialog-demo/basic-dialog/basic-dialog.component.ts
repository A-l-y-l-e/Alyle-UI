import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog, LyDialogRef } from '@alyle/ui/dialog';

const STYLES_DIALOG_DEMO = ({
  background: '#ccc'
});

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
      width: 320,
      dialogStyleBlock: STYLES_DIALOG_DEMO
    });
    dialogRef.afterClosed.subscribe((result) => console.log(result));
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
