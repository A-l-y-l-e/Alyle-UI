import { Component, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog, LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import { filter } from 'rxjs/operators';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'aui-dialog-prompt',
  templateUrl: './dialog-prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DialogPromptComponent {

  name: string;

  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef
  ) { }

  open() {
    const dialogRef = this._dialog.open<DialogPromptDialog, DialogData>(DialogPromptDialog, {
      width: 250,
      data: {
        name: this.name
      }
    });
    dialogRef.afterClosed
    .pipe(filter(result => !!result))
    .subscribe(result => {
      this.name = result;
      this._cd.markForCheck();
    });
  }

}

@Component({
  templateUrl: './dialog-prompt-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DialogPromptDialog {
  constructor(
    public dialogRef: LyDialogRef,
    @Inject(LY_DIALOG_DATA) public data: DialogData
  ) { }
}
