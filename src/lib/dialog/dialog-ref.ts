import { Injectable } from '@angular/core';
import { OverlayRef } from '@alyle/ui';
import { LyDialogContainer } from './dialog-container.component';

@Injectable()
export class LyDialogRef {
  private _result: any;
  get afterOpened() {
    return (
      this._overlay.ref.componentRef!.instance as LyDialogContainer
    )._afterOpened.asObservable();
  }
  get beforeClosed() {
    return (
      this._overlay.ref.componentRef!.instance as LyDialogContainer
    )._beforeClosed.asObservable();
  }
  get afterClosed() {
    return (
      this._overlay.ref.componentRef!.instance as LyDialogContainer
    )._afterClosed.asObservable();
  }

  /** @internal */
  get result() {
    return this._result;
  }
  constructor(
    private _overlay: OverlayRef
  ) {

  }
  close(result?: any) {
    const dialogContainer = (this._overlay.ref.componentRef!.instance as LyDialogContainer);
    dialogContainer._beforeClosed.next(result);
    dialogContainer._beforeClosed.complete();
    dialogContainer._startClose();
    this._result = result;
  }
}
