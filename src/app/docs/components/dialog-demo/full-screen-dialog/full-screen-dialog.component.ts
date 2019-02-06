import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog, LyDialogRef } from '@alyle/ui/dialog';

@Component({
  selector: 'aui-full-screen-dialog',
  templateUrl: './full-screen-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenDialogComponent {

  constructor(
    private _dialog: LyDialog
  ) { }

  open() {
    const dialogRef = this._dialog.open<FullScreenDialog>(FullScreenDialog, {
      width: '100vw',
      height: '100vh',
      maxWidth: null, // current style overrides
      maxHeight: null // current style overrides
    });
    dialogRef.afterClosed.subscribe((result) => console.log(result));
  }

}

@Component({
  templateUrl: './full-screen-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenDialog {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
