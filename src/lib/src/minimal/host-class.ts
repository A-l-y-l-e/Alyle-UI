import { Injectable, ElementRef, Renderer2 } from '@angular/core';


@Injectable()
export class LyHostClass {
  private readonly _set = new Set<string>();
  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2
  ) { }

  add(className: string) {
    if (!this._set.has(className)) {
      this._set.add(className);
      this._renderer.addClass(this._el.nativeElement, className);
    }
  }

  remove(className: string) {
    if (this._set.has(className)) {
      this._set.delete(className);
      this._renderer.removeClass(this._el.nativeElement, className);
    }
  }

  toggle(className: string, enabled: boolean) {
    if (enabled) {
      this.add(className);
    } else {
      this.remove(className);
    }
  }
}
