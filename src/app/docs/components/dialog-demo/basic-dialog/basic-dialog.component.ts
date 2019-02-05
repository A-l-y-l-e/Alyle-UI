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
    const dialogRef = this._dialog.open<DialogDemo, string>(DialogDemo, {
      width: 320
    });
    dialogRef.beforeClosed.subscribe((result) => console.warn(result));
  }

}

@Component({
  template: `
  <h4 ly-dialog-title gutterBottom>Use location service?</h4>
  <div ly-dialog-content>
    <p lyTyp="body2" color="text:secondary">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam earum dolor, iusto fugit in dolore.
    </p>
  </div>
  <ly-grid ly-dialog-actions container justify="end">
    <button ly-button color="primary" (click)="dialogRef.close()">DISAGREE</button>
    <button ly-button color="primary" (click)="dialogRef.close(true)">AGREE</button>
  </ly-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogDemo {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
