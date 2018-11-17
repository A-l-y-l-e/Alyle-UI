import { Component } from '@angular/core';
import { LySnackBarDismiss } from 'lib/snack-bar/snack-bar';

@Component({
  selector: 'aui-basic-snack-bar',
  templateUrl: './basic-snack-bar.component.html'
})
export class BasicSnackBarComponent {
  afterDismissed(e: LySnackBarDismiss) {
    console.log(e);
  }
}
