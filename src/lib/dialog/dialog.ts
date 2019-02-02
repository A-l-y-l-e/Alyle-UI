import { Injectable, Type, TemplateRef } from '@angular/core';
import { LyOverlay } from '@alyle/ui';

@Injectable()
export class LyDialog {
  constructor(
    private _overlay: LyOverlay
  ) { }
  open<T>(componentOrTemplateRef: Type<T> | TemplateRef<T>) {

  }
}
