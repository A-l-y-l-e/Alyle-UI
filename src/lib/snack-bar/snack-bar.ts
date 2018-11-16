import { Directive, Input, TemplateRef, OnDestroy } from '@angular/core';
import { LyOverlay, OverlayFromTemplateRef } from '@alyle/ui';

@Directive({
  selector: 'ng-template[ly-snack-bar]',
  exportAs: 'lySnackBar'
})
export class LySnackBar implements OnDestroy {
  private _snackBarOverlay: OverlayFromTemplateRef;
  @Input() duration: number;
  constructor(
    private _overlay: LyOverlay,
    private _templateRef: TemplateRef<any>
  ) { }

  ngOnDestroy() {
    this.close();
  }

  open() {
    // close previous overlay if exist
    this.close();

    this._snackBarOverlay = this._overlay.create(this._templateRef, undefined, {
      styles: { }
    });
  }

  /** close snackBar */
  close() {
    if (this._snackBarOverlay) {
      this._snackBarOverlay.destroy();
      this._snackBarOverlay = null;
    }
  }
}
