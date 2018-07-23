import {
  Directive,
  Input,
  OnInit,
  Inject,
  Renderer2,
  ElementRef
} from '@angular/core';

import { CoreTheme } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '../tokens';

@Directive({
  selector: '[lyShow], [lyHide]'
})
export class MediaDirective implements OnInit {
  private _show: string;
  private _showClass: string;
  private _hide: string;
  private _hideClass: string;
  classes = {
    hide: this.coreTheme.setUpStyle('k-media-hide', 'display:none;', 'all')
  };

  @Input()
  set lyShow(val: string) {
    this._show = val;
    const newClass = this.coreTheme.setUpStyle(`k-media-show-${val}`,
    (
      `display: block;`
    )
    ,
    `${this.mediaQueries[val] || val}`// , InvertMediaQuery.Yes
    );
    this.coreTheme.updateClassName(this._elementRef.nativeElement, this._renderer, newClass, this._showClass);
    this._showClass = newClass;
  }

  get lyShow(): string {
    return this._show;
  }

  @Input()
  set lyHide(val: string) {
    this._hide = val;
    const newClass = this.coreTheme.setUpStyle(`k-media-hide-${val}`,
    (
      `display: none !important;`
    )
    ,
    `${this.mediaQueries[val] || val}`
    );
    this.coreTheme.updateClassName(this._elementRef.nativeElement, this._renderer, newClass, this._hideClass);
    this._hideClass = newClass;
  }

  get lyHide(): string {
    return this._hide;
  }

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private coreTheme: CoreTheme,
    @Inject(LY_MEDIA_QUERIES) private mediaQueries: any, // { [key: string]: string; }
  ) { }

  ngOnInit() {
    if (!this.lyHide) {
      this._renderer.addClass(this._elementRef.nativeElement, this.classes.hide);
    }
  }

}
