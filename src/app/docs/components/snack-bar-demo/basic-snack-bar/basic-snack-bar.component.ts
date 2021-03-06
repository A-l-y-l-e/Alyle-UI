import { Component } from '@angular/core';
import { LySnackBarDismiss } from '@alyle/ui/snack-bar';

@Component({
  selector: 'aui-basic-snack-bar',
  templateUrl: './basic-snack-bar.component.html'
})
export class BasicSnackBarComponent {
  data = {
    val: 'test'
  };
  afterDismissed(e: LySnackBarDismiss) {
    console.log(e);
  }
}
