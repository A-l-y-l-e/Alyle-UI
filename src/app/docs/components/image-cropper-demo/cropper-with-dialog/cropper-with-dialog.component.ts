import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';

import { CropperDialog } from './cropper-dialog';

@Component({
  selector: 'aui-cropper-with-dialog',
  templateUrl: './cropper-with-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropperWithDialogComponent {
  cropped?: string;
  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef
  ) { }

  openCropperDialog(event: Event) {
    this._dialog.open<CropperDialog, Event>(CropperDialog, {
      data: event,
      width: 320,
      disableClose: true
    }).afterClosed.subscribe((result: ImgCropperEvent) => {
      this.cropped = result.dataURL;
      this._cd.markForCheck();
    });
  }
}
