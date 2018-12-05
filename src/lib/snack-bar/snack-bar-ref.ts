import { EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { OverlayFromTemplateRef, LyTheme2 } from '@alyle/ui';
import { LySnackBarService } from './snack-bar.service';
import { LySnackBarDismiss } from './snack-bar';

const DEFAULT_DURATION = 6e3;

export class LySnackBarRef {
  private _timer: any;
  private _dismissedByAction = false;

  /** Subject for notifying the user that the snack bar has been dismissed. */
  private readonly _afterDismissed = new Subject<void>();

  /** Gets an observable that is notified when the snack bar is finished closing. */
  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }
  constructor(
    private _snackBarService: LySnackBarService,
    private _overlay: OverlayFromTemplateRef,
    private _afterDismissedEventEmitter: EventEmitter<LySnackBarDismiss>,
    duration: number,
    private _theme: LyTheme2
  ) {
    this._timer = setTimeout(() => {
      this.dismiss();
    }, duration || DEFAULT_DURATION);
  }

  dismiss() {
    const snackBar = this._overlay;
    const timer = this._timer;
    this._afterDismissedEventEmitter.emit({dismissedByAction: this._dismissedByAction});
    this._afterDismissed.next();
    this._afterDismissed.complete();
    if (snackBar) {
      if (timer) {
        // clear previous timer
        clearTimeout(timer);
      }

      snackBar.containerElement.classList.remove(this._theme.addStyle('SnackBar:open', null, null, null, null));
      setTimeout(() => {
        snackBar.destroy();
      }, 350);
      this._snackBarService._currentSnackBar = null;
      this._overlay = null;
    }
  }
  dismissWithAction() {
    const snackBar = this._overlay;
    if (snackBar) {
      this._dismissedByAction = true;
      this.dismiss();
    }
  }
}
