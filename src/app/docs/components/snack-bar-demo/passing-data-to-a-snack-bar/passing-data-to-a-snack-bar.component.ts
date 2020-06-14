import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { LySnackBar } from '@alyle/ui/snack-bar';

@Component({
  selector: 'aui-passing-data-to-a-snack-bar',
  templateUrl: './passing-data-to-a-snack-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassingDataToASnackBarComponent {

  @ViewChild('sb') sb: LySnackBar;

  open() {
    this.sb.open({
      msg: 'Hello world!! 🎉'
    });
  }

}
