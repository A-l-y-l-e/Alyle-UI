import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeVariables, lyl, StyleRenderer } from '@alyle/ui';
import { LyDialogRef, LyDialog } from '@alyle/ui/dialog';

const STYLES = (theme: ThemeVariables) => {
  return {
    dialog: lyl `{
      @media ${theme.breakpoints['Small']},
      ${theme.breakpoints['XSmall']} {
        border-radius: 0
      }
    }`
  };
};

@Component({
  selector: 'aui-dialog-responsive',
  templateUrl: './dialog-responsive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ]
})
export class DialogResponsiveComponent {

  readonly classes = this.sRenderer.renderSheet(STYLES);

  constructor(
    private _dialog: LyDialog,
    private sRenderer: StyleRenderer
  ) { }

  open() {
    const dialogRef = this._dialog.open<DialogResponsiveDemo>(DialogResponsiveDemo, {
      width: [320, '100vw@XSmall@Small'],
      height: '100vh@XSmall@Small',
      maxWidth: '100vw@XSmall@Small',
      maxHeight: '100vh@XSmall@Small',
      containerClass: this.classes.dialog
    });
    dialogRef.afterClosed.subscribe((result) => console.log(result));
  }

}

@Component({
  templateUrl: './dialog-responsive-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogResponsiveDemo {
  constructor(
    public dialogRef: LyDialogRef
  ) { }
}
