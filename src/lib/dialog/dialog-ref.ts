import { Injectable } from '@angular/core';
import { LyOverlayRef } from '@alyle/ui';
import { LyDialogContainer } from './dialog-container.component';

@Injectable()
export class LyDialogRef {
  private _result: any;
  get afterOpened() {
    return (
      this._overlayRef.componentRef!.instance as LyDialogContainer
    )._afterOpened.asObservable();
  }
  get beforeClosed() {
    return (
      this._overlayRef.componentRef!.instance as LyDialogContainer
    )._beforeClosed.asObservable();
  }
  get afterClosed() {
    return (
      this._overlayRef.componentRef!.instance as LyDialogContainer
    )._afterClosed.asObservable();
  }

  /**
   * @internal
   * @docs-private
   */
  get result() {
    return this._result;
  }
  constructor(
    private _overlayRef: LyOverlayRef
  ) {

  }
  close(result?: any) {
    const dialogContainer = (this._overlayRef.componentRef!.instance as LyDialogContainer);
    dialogContainer._beforeClosed.next(result);
    dialogContainer._beforeClosed.complete();
    dialogContainer._startClose();
    this._result = result;
  }
}
