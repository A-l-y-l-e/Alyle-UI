import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { LyDialog, LyDialogRef } from '@alyle/ui/dialog';

const STYLES_DIALOG = ({
  width: '100vw',
  height: '100vh',
  borderRadius: 0
});

@Component({
  selector: 'aui-full-screen-dialog',
  templateUrl: './full-screen-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenDialogComponent {

  constructor(
    private _dialog: LyDialog,
    private _theme: LyTheme2
  ) { }

  open() {
    const dialogRef = this._dialog.open<FullScreenDialog>(FullScreenDialog, {
      maxWidth: null, // current style overrides
      maxHeight: null, // current style overrides
      containerClass: this._theme.style(STYLES_DIALOG)
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
