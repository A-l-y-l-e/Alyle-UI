import { ElementRef, Renderer2 } from '@angular/core';
import { CoreTheme } from '@alyle/ui';

export class LyFlexBase {
  constructor(
    public _elementRef: ElementRef,
    public _renderer: Renderer2,
    public _coreTheme: CoreTheme,
    public _mediaQueries: {[key: string]: string},
  ) { }

  _updateClass(newClass: string, oldClass: string) {
    this._coreTheme.updateClassName(this._elementRef.nativeElement, this._renderer, newClass, oldClass);
  }
}
