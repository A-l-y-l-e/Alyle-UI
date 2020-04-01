import { Injectable, ElementRef, Renderer2 } from '@angular/core';


@Injectable()
export class LyHostClass {
  private readonly _set = new Set<string>();
  private _nEl: HTMLElement;

  constructor(
    _el: ElementRef,
    private _renderer: Renderer2
  ) {
    this._nEl = _el.nativeElement;
    console.log(`LyHostClass: Deprecated use instead StyleRenderer`);
  }

  add(className: string) {
    if (!this._set.has(className)) {
      this._set.add(className);
      this._renderer.addClass(this._nEl, className);
    }
  }

  remove(className?: string | null) {
    if (className && this._set.has(className)) {
      this._set.delete(className);
      this._renderer.removeClass(this._nEl, className);
    }
  }

  toggle(className: string, enabled: boolean) {
    if (enabled) {
      this.add(className);
    } else {
      this.remove(className);
    }
  }

  update(newClassName: string, oldClassName: string | null | undefined) {
    this.remove(oldClassName);
    this.add(newClassName);
    return newClassName;
  }
}

