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
  template: '<button ly-button (click)="dialogRef.close()">close</button>'
})
export class DialogDemo {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
