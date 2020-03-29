import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';

import { CropperDialog } from './cropper-dialog';

@Component({
  selector: 'aui-cropper-with-dialog',
  templateUrl: './cropper-with-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropperWithDialogComponent {

  constructor(
    private _dialog: LyDialog
  ) { }

  openCropperDialog(event: Event) {
    this._dialog.open<CropperDialog, Event>(CropperDialog, {
      data: event,
      width: 320,
      disableClose: true
    });
  }
}
