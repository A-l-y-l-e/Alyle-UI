import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyDialog, LyDialogRef } from '@alyle/ui/dialog';

const STYLES = (_theme: ThemeVariables) => ({ });

@Component({
  selector: 'aui-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicDialogComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);

  constructor(
    private _theme: LyTheme2,
    private _dialog: LyDialog
  ) { }

  ngOnInit() {
  }

  open() {
    const dialogRef = this._dialog.open(DialogDemo, {
      width: 250
    });
    dialogRef.beforeClosed.subscribe((result) => console.warn(result));
  }

}

@Component({
  template: `
  <h4 ly-dialog-title gutterBottom>Title</h4>
  <ly-grid ly-dialog-actions container justify="end">

  <button ly-button color="primary" (click)="dialogRef.close('data')">Ok</button>
  </ly-grid>
  `
})
export class DialogDemo {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
