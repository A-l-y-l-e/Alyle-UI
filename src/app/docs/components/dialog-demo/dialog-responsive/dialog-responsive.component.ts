import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeVariables, LyTheme2 } from '@alyle/ui';
import { LyDialogRef, LyDialog } from '@alyle/ui/dialog';

const STYLES_DIALOG = (theme: ThemeVariables) => ({
  width: '320px',
  [theme.getBreakpoint('Small')]: {
    borderRadius: 0,
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw !important',
    maxHeight: '100vh !important'
  }
});

@Component({
  selector: 'aui-dialog-responsive',
  templateUrl: './dialog-responsive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogResponsiveComponent {

  constructor(
    private _dialog: LyDialog,
    private _theme: LyTheme2
  ) { }

  open() {
    const dialogRef = this._dialog.open<DialogResponsiveDemo>(DialogResponsiveDemo, {
      containerClass: this._theme.style(STYLES_DIALOG)
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
