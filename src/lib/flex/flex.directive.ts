import { Directive, Input, OnChanges, SimpleChanges, Renderer2, ElementRef, isDevMode, Inject } from '@angular/core';
import { CoreTheme, Undefined } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '@alyle/ui/responsive';

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

export type FxDirection = 'row' | 'rowReverse' | 'column' | 'columnReverse' | null;
export type FxWrap = 'nowrap' | 'wrap' | 'wrap-reverse' | null;
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
  selector: '[fxDisplay], [fxFlow], [fxDirection], [fxWrap], [fxAlign]',
  exportAs: 'lyFx'
})
export class LyFlex implements OnChanges {
  private _fxDisplay: 'flex' | 'inline';
  private fxDisplayClass: string;

  /** <FxDirection> + <FxWrap> */
  private _fxFlow: FxFlow;
  private fxFlowClass: string;

  private _fxAlign: FxAlign;
  private fxAlignClass: string;

  private _fxDirection: FxDirection;
  private fxDirectionClass: string;

  private _fxWrap: FxWrap;
  private fxWrapClass: string;

  @Input()
  set fx(val: string[]) {
    // code <div fx="['align:center:lg', 'align:between:xs']"></div>
  }
  @Input()
  set fxDisplay(val: 'flex' | 'inline') {
    if (this.fxDisplay !== val) {
      const newClass = this._createDisplayClass(val);
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxDisplayClass);
      this.fxDisplayClass = newClass;
    }
  }
  get fxDisplay() {
    return this._fxDisplay;
  }

  @Input()
  set fxFlow(val: FxFlow) {
    if (this.fxFlow !== val) {
      const newClass = this._createFlowClass(val);
      /** Add class */
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxFlowClass);
      this.fxFlowClass = newClass;
    }
  }
  get fxFlow() {
    return this._fxFlow;
  }

  @Input()
  set fxAlign(val: FxAlign) {
    if (this.fxAlign !== val) {
      /** create Style */
      const newClass = this._createAlignClass(val);

      /** Add class */
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxAlignClass);
      this.fxAlignClass = newClass;
    }
  }
  get fxAlign() {
    return this._fxAlign;
  }

  @Input()
  set fxDirection(val: FxDirection) {
    if (this._fxDirection !== val) {
      const newKey = val || 'row';
      this._fxDirection = newKey;
      /** create Style */
      const newClass = this._createDirectionClass(val);
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxDirectionClass);
      this.fxDirectionClass = newClass;
    }
  }
  get fxDirection() {
    return this._fxDirection;
  }

  @Input()
  set fxWrap(val: FxWrap) {
    if (this.fxWrap !== val) {
      /** create Style */
      const newClass = this._createWrapClass(val);
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxWrapClass);
      this.fxWrapClass = newClass;
    }
  }
  get fxWrap() {
    return this._fxWrap;
  }
  constructor(
    @Inject(LY_MEDIA_QUERIES) mediaQueries: any,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private coreTheme: CoreTheme
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this._fxDisplay && !this.fxDisplayClass) {
      /** Set default display */
      this.fxDisplay = null;
    }
  }

  private _createDisplayClass(val: 'flex' | 'inline') {
    this._checkVal(val);

    this._fxDisplay = val || 'flex';
    return this.coreTheme.setUpStyle(`k-fx-display:${this.fxDisplay}`,
      () => (
        val === 'inline' ? `display:inline-flex;` : `display:flex;`
      )
    );
  }

  private _createFlowClass(val: string) {
    this._checkVal(val);

    this._fxFlow = val || 'row wrap';

    /** create Style */
    return this.coreTheme.setUpStyle(`k-fx-flow:${this.fxFlow}`,
      () => `flex-flow:${this.fxFlow}`
    );
  }

  private _createAlignClass(val: string) {
    this._checkVal(val);

    this._fxAlign = val || 'start stretch';
    /** create Style */
    return this.coreTheme.setUpStyle(`k-fx-align:${this.fxAlign}`,
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
      }
    );
  }

  private _createDirectionClass(val: FxDirection) {

    this._fxDirection = val || 'row';
    /** create Style */
    return this.coreTheme.setUpStyle(`k-fx-direction:${this.fxDirection}`, {
      '': () => (
        `flex-direction:${__align[this.fxDirection]};`
      )
    });
  }

  private _createWrapClass(val: FxWrap) {
    this._fxWrap = val || 'wrap';
    /** create Style */
    return this.coreTheme.setUpStyle(`k-fx-wrap:${this.fxWrap}`, {
      '': () => (
        `flex-wrap:${__align[this.fxWrap]};`
      )
    });
  }

  /** Check if value is string else emit error */
  private _checkVal(val: any) {
    if (isDevMode() && Array.isArray(val)) {
      console.warn(val, this.elementRef, `\n🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋🠋`);
      throw new Error(`value: '${val}' is not a string in`);
    }
  }

}
