import { Directive, Input, Renderer2, ElementRef, Inject, Optional } from '@angular/core';
import { CoreTheme, Undefined } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '@alyle/ui/responsive';
import { LyFlex } from './flex.directive';
import { LyFlexBase } from './flex-base';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fxItem], [fxFlex], [fxOrder]',
  exportAs: 'lyFxItem'
})
export class LyFlexItem extends LyFlexBase {

  private _fxFlex: string;
  private _fxFlexClass: string;

  private _fxOrder: string;
  private _fxOrderClass: string;

  private _fxAlignSelf: string;
  private _fxAlignSelfClass: string;

  private _rawClass: string[];

  @Input()
  set fxItem(valArray: string[]) {
    if (!this._rawClass) {
      this._rawClass = [];
    }

    /** Save previous classes  */
    const prevClasses = this._rawClass;

    /** Clear rawClass */
    if (this._rawClass.length) {
      this._rawClass = [];
    }
    valArray.forEach(key => {
      let newClass;
      const values = key.split(':');
      if (values[0] === 'flex') {
        newClass = this._createFlexClass(key, values[1] as any, this._mediaQueries[(values[2])]);
      } else
      if (values[0] === 'order') {
        newClass = this._createOrderClass(key, values[1], this._mediaQueries[(values[2])]);
      } else
      if (values[0] === 'alignSelf') {
        newClass = this._createAlignSelfClass(key, values[1], this._mediaQueries[(values[2])]);
      }
      this._rawClass.push(newClass);
    });
    /** Delete previous classes if they exist */
    if (prevClasses.length) {
      prevClasses.forEach(klass => {
        this._renderer.removeClass(this._elementRef.nativeElement, klass);
      });
    }
    /** Add new class */
    this._rawClass.forEach(klass => {
      this._renderer.addClass(this._elementRef.nativeElement, klass);
    });
  }

  /** Works the same as flex, default: 1 */
  @Input()
  set fxFlex(val: string) {
    if (this.fxFlex !== val) {
      /** create Style */
      const newClass = this._createFlexClass(val, val);
      this._updateClass(newClass, this._fxFlexClass);
      this._fxFlexClass = newClass;
    }
  }
  get fxFlex() {
    return this._fxFlex;
  }

  /** Works the same as order, default: 1 */
  @Input()
  set fxOrder(val: string) {
    if (this.fxOrder !== val) {
      /** create Style */
      const newClass = this._createOrderClass(val, val);
      this._updateClass(newClass, this._fxOrderClass);
      this._fxOrderClass = newClass;
    }
  }
  get fxOrder() {
    return this._fxOrder;
  }

  /** Works the same as order, align-self: center */
  @Input()
  set fxAlignSelf(val: string) {
    if (this.fxAlignSelf !== val) {
      /** create Style */
      const newClass = this._createAlignSelfClass(val, val);
      this._updateClass(newClass, this._fxAlignSelfClass);
      this._fxAlignSelfClass = newClass;
    }
  }
  get fxAlignSelf() {
    return this._fxAlignSelf;
  }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    coreTheme: CoreTheme,
    @Optional() @Inject(LY_MEDIA_QUERIES) mediaQueries: any,
    @Optional() private lyFlex: LyFlex
  ) {
    super(elementRef, renderer, coreTheme, mediaQueries);
  }

  private _createFlexClass(key: string, val: string, media?: string) {
    this._fxFlex = val || '1';
    const newKey = `k-fx-flex:${key || this.fxFlex}`;
    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => (
        `flex:${this.fxFlex};`
      ),
      media
    );
  }

  private _createOrderClass(key: string, val: string, media?: string) {
    this._fxOrder = val || '1';
    const newKey = `k-fx-order:${key || this.fxOrder}`;
    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => (
        `order:${this.fxOrder};`
      ),
      media
    );
  }

  private _createAlignSelfClass(key: string, val: string, media?: string) {
    this._fxAlignSelf = val || '1';
    const newKey = `k-fx-alignSelf:${key || this.fxAlignSelf}`;
    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => (
        `align-self:${this.fxAlignSelf};`
      ),
      media
    );
  }
}
