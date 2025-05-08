import { Component } from '@angular/core';
import { LySnackBarDismiss } from '@alyle/ui/snack-bar';

@Component({
  selector: 'aui-basic-snack-bar',
  templateUrl: './basic-snack-bar.component.html',
  standalone: false
})
export class BasicSnackBarComponent {
  afterDismissed(e: LySnackBarDismiss) {
    console.log(e);
  }
}
