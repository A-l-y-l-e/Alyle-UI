import {
  Directive,
  Input,
  OnInit,
  OnChanges,
  Inject,
  Renderer2,
  ElementRef
} from '@angular/core';

import { LyTheme2 } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '../tokens';

const MEDIA_PRIORITY = 999;

const styles = {
  hide: {
    display: 'none'
  }
};

@Directive({
  selector: '[lyShow], [lyHide]'
})
export class MediaDirective implements OnInit, OnChanges {
  private _show: string;
  private _showClass: string;
  private _hide: string;
  private _hideClass: string;

  /**
   * Styles
   * @ignore
   */
  classes = this.theme.addStyleSheet(styles, 'lyMedia');

  /**
   * Shows the item when the value is resolved as true
   */
  @Input()
  get lyShow(): string {
    return this._show;
  }
  set lyShow(val: string) {
    this._show = val;
    this._showClass = this.theme.addStyle(`lyMedia-show:${val}`,
    {
      [`@media ${this.mediaQueries[val] || val}`]: {
        display: `block`
      }
    },
    this._elementRef.nativeElement,
    this._showClass,
    MEDIA_PRIORITY
    );
  }

  /**
   * Hides the item when the value is resolved as true
   */
  @Input()
  set lyHide(val: string) {
    this._hide = val;
    this._hideClass = this.theme.addStyle(`lyMedia-hide:${val}`,
    {
      [`@media ${this.mediaQueries[val] || val}`]: {
        display: 'none'
      }
    },
    this._elementRef.nativeElement,
    this._hideClass,
    MEDIA_PRIORITY
    );
  }

  get lyHide(): string {
    return this._hide;
  }

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private theme: LyTheme2,
    @Inject(LY_MEDIA_QUERIES) private mediaQueries: any, // { [key: string]: string; }
  ) { }

  ngOnInit() {
    if (!this.lyHide) {
      this._renderer.addClass(this._elementRef.nativeElement, this.classes.hide);
    }
  }

  ngOnChanges() {
    if (this.lyHide && this.lyShow) {
      throw new Error(`use only \`lyHide\` or \`lyShow\` per element`);
    }
  }

}
