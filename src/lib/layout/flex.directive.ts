import { Directive, Input, OnChanges, Renderer2, ElementRef, isDevMode, Inject, Optional } from '@angular/core';
import { CoreTheme } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '@alyle/ui/responsive';
import { LyFlexBase } from './flex-base';

enum __align {
  flex,
  inline,
  row = 'row',
  rowReverse = 'row-reverse',
  column = 'column',
  columnReverse = 'column-reverse',
  nowrap = 'nowrap',
  wrap = 'wrap',
  wrapReverse = 'wrap-reverse',
  start = 'flex-start',
  center = 'center',
  end = 'flex-end',
  between = 'space-between',
  around = 'space-around',
  evenly = 'space-evenly',
  baseline = 'baseline',
  stretch = 'stretch',
}
/** 'row' | 'rowReverse' | 'column' | 'columnReverse' */
export type FxDirection = string | null;
/** 'nowrap' | 'wrap' | 'wrap-reverse' */
export type FxWrap = string | null;
/** [FxDirection, FxWrap] */
export type FxFlow = string;
export type FxJustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | null;
export type FxAlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | null;
export type FxAlignContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch' | null;
export type FxAlignItemsAndContent = 'start' | 'center' | 'end' | 'stretch' | null;
/**
 * [FxJustifyContent] | [FxJustifyContent, FxAlignItemsAndContent] | [FxJustifyContent, FxAlignItems, FxAlignContent]
 */
export type FxAlign = string;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fxDisplay], [fxFlow], [fxDirection], [fxWrap], [fxAlign], [fx]',
  exportAs: 'lyFx'
})
export class LyFlex extends LyFlexBase implements OnChanges {
  private _fxDisplay: 'flex' | 'inline';
  private _fxDisplayClass: string;

  /** <FxDirection> + <FxWrap> */
  private _fxFlow: FxFlow;
  private _fxFlowClass: string;

  private _fxAlign: FxAlign;
  private _fxAlignClass: string;

  private _fxDirection: FxDirection;
  private _fxDirectionClass: string;

  private _fxWrap: FxWrap;
  private _fxWrapClass: string;

  private _rawClass: string[];

  @Input()
  set fx(valArray: string[]) {
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
      if (values[0] === 'display') {
        newClass = this._createDisplayClass(key, values[1] as any, this._mediaQueries[(values[2])]);
      } else
      if (values[0] === 'flow') {
        newClass = this._createFlowClass(key, values[1], this._mediaQueries[(values[2])]);
      } else
      if (values[0] === 'align') {
        newClass = this._createAlignClass(key, values[1], this._mediaQueries[(values[2])]);
      } else
      if (values[0] === 'direction') {
        newClass = this._createDirectionClass(key, values[1], this._mediaQueries[(values[2])]);
      } else
      if (values[0] === 'wrap') {
        newClass = this._createWrapClass(key, values[1], this._mediaQueries[(values[2])]);
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
  @Input()
  set fxDisplay(val: 'flex' | 'inline') {
    if (this.fxDisplay !== val) {
      const newClass = this._createDisplayClass(val, val);
      this._updateClass(newClass, this._fxDisplayClass);
      this._fxDisplayClass = newClass;
    }
  }
  get fxDisplay() {
    return this._fxDisplay;
  }

  @Input()
  set fxFlow(val: FxFlow) {
    if (this.fxFlow !== val) {
      const newClass = this._createFlowClass(val, val);
      this._updateClass(newClass, this._fxFlowClass);
      this._fxFlowClass = newClass;
    }
  }
  get fxFlow() {
    return this._fxFlow;
  }

  @Input()
  set fxAlign(val: FxAlign) {
    if (this.fxAlign !== val) {
      /** create Style */
      const newClass = this._createAlignClass(val, val);
      this._updateClass(newClass, this._fxAlignClass);
      this._fxAlignClass = newClass;
    }
  }
  get fxAlign() {
    return this._fxAlign;
  }

  @Input()
  set fxDirection(val: FxDirection) {
    if (this._fxDirection !== val) {
      /** create Style */
      const newClass = this._createDirectionClass(val, val);
      this._updateClass(newClass, this._fxDirectionClass);
      this._fxDirectionClass = newClass;
    }
  }
  get fxDirection() {
    return this._fxDirection;
  }

  @Input()
  set fxWrap(val: FxWrap) {
    if (this.fxWrap !== val) {
      /** create Style */
      const newClass = this._createWrapClass(val, val);
      this._updateClass(newClass, this._fxWrapClass);
      this._fxWrapClass = newClass;
    }
  }
  get fxWrap() {
    return this._fxWrap;
  }

  constructor(
    @Optional() @Inject(LY_MEDIA_QUERIES) mediaQueries: any,
    elementRef: ElementRef,
    renderer: Renderer2,
    coreTheme: CoreTheme,
  ) {
    super(elementRef, renderer, coreTheme, mediaQueries);
  }

  ngOnChanges() {
    if (!this._fxDisplay) {
      /** Set default display */
      this.fxDisplay = null;
    }
  }

  private _createDisplayClass(key: string, val: 'flex' | 'inline', media?: string) {
    this._checkVal(val);

    this._fxDisplay = val || 'flex';
    const newKey = `k-fx-display:${key || this.fxDisplay}`;
    return this._coreTheme.setUpStyle(newKey,
      () => (
        val === 'inline' ? `display:inline-flex;` : `display:flex;`
      ),
      media
    );
  }

  private _createFlowClass(key: string, val: string, media?: string) {
    this._checkVal(val);

    this._fxFlow = val || 'row wrap';
    const newKey = `k-fx-flow:${key || this.fxFlow}`;
    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => `flex-flow:${this.fxFlow}`,
      media
    );
  }

  private _createAlignClass(key: string, val: string, media?: string) {
    this._checkVal(val);

    this._fxAlign = val || 'start stretch';
    const newKey = `k-fx-align:${key || this.fxAlign}`;
    /** create Style */
    return  this._coreTheme.setUpStyle(newKey,
      () => {
        const arrayVal = this.fxAlign.split(' ');

        const justifyContent = arrayVal[0] || 'start';
        const alignItems = arrayVal[1] || 'stretch';
        const alignContent = arrayVal[2];
        return (
          `justify-content:${__align[justifyContent]};` +
          `align-items:${__align[alignItems]};` +
          `align-content:${__align[alignContent || alignItems]};`
        );
      },
      media
    );
  }

  private _createDirectionClass(key: string, val: FxDirection, media?: string) {

    this._fxDirection = val || 'row';
    const newKey = `k-fx-direction:${key || this.fxDirection}`;
    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => (
        `flex-direction:${__align[this.fxDirection]};`
      ),
      media
    );
  }

  private _createWrapClass(key: string, val: FxWrap, media?: string) {
    this._fxWrap = val || 'wrap';
    const newKey = `k-fx-wrap:${key || this.fxWrap}`;

    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => (
        `flex-wrap:${__align[this.fxWrap]};`
      ),
      media
    );
  }

  /** Check if value is string else emit error */
  private _checkVal(val: any) {
    if (isDevMode() && Array.isArray(val)) {
      console.warn(val, 'in', this._elementRef, `\n🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋`);
      throw new Error(`value: '${val}' is not a string in`);
    }
  }

}
