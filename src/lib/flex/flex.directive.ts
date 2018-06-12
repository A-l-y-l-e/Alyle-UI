import { Directive, Input, OnChanges, SimpleChanges, Renderer2, ElementRef, isDevMode } from '@angular/core';
import { CoreTheme, Undefined } from '@alyle/ui';

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
export type FxFlow = [FxDirection, FxWrap] | string;
export type FxJustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | null;
export type FxAlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | null;
export type FxAlignContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch' | null;
export type FxAlignItemsAndContent = 'start' | 'center' | 'end' | 'stretch' | null;

export type FxAlign = [FxJustifyContent] | [FxJustifyContent, FxAlignItemsAndContent] | [FxJustifyContent, FxAlignItems, FxAlignContent] | string;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fxDisplay], [fxFlow], [fxDirection], [fxWrap], [fxAlign]',
  exportAs: 'lyFx'
})
export class LyFlex implements OnChanges {
  private _fxDisplay: 'flex' | 'inline';
  private fxDisplayClass: string;
  private _fxFlow: FxFlow; // <FxDirection> + <FxWrap>
  private fxFlowClass: string;
  private _fxAlign: FxAlign;
  private fxAlignClass: string;
  private _fxDirection: FxDirection;
  private fxDirectionClass: string;
  private _fxWrap: FxWrap;
  private fxWrapClass: string;
  private _currentClassname: string;

  @Input()
  set fxDisplay(val: 'flex' | 'inline') {
    if (this._fxDisplay !== val) {
      this._fxDisplay = val || 'flex';
      const newClass = this._createDisplay(this._fxDisplay);
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxDisplayClass);
      this.fxDisplayClass = newClass;
    }
  }
  get fxDisplay() {
    return this._fxDisplay;
  }

  @Input()
  set fxFlow(val: FxFlow) {
    if (this._fxFlow !== val) {
      const newVal = val || 'row wrap';
      const key = typeof val === 'string' ? newVal as string : `${val[0]} ${val[1]}`;
      this._fxFlow = val || key;

      /** create Style */
      const newClass = this.coreTheme.setUpStyle(key, {
        '': () => (
          `flex-flow:${key}`
        )
      });
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
    if (this._fxAlign !== val) {
      const arrayVal = typeof val === 'string' ? val.split(' ') : val;

      const justifyContent = arrayVal[0] || 'start';
      const alignItems = arrayVal[1] || 'stretch';
      const alignContent = arrayVal[2];

      const key = !!val && typeof val === 'string' ? val : `${justifyContent} ${alignItems} ${alignContent || alignItems}`;
      this._fxAlign = val || key;
      /** create Style */
      const newClass = this.coreTheme.setUpStyle(key, {
        '': () => (
        `justify-content:${__align[justifyContent]};` +
        `align-items:${__align[alignItems]};` +
        `align-content:${__align[alignContent || alignItems]};`
        )
      });
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
      const newClass = this.coreTheme.setUpStyle(newKey, {
        '': () => (
          `flex-direction:${__align[newKey]};`
        )
      });
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxDirectionClass);
      this.fxDirectionClass = newClass;
    }
  }
  get fxDirection() {
    return this._fxDirection;
  }

  @Input()
  set fxWrap(val: FxWrap) {
    if (this._fxWrap !== val) {
      const newKey = val || 'wrap';
      this._fxWrap = newKey;
      /** create Style */
      const newClass = this.coreTheme.setUpStyle(val, {
        '': () => (
          `flex-wrap:${__align[newKey]};`
        )
      });
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, newClass, this.fxWrapClass);
      this.fxWrapClass = newClass;
    }
  }
  get fxWrap() {
    return this._fxWrap;
  }
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private coreTheme: CoreTheme
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.fxDisplayClass) {
      /** Set default display */
      this.fxDisplay = null;
    }
  }

  private _createDisplay(val: 'flex' | 'inline') {
    const displayStyle = val === 'flex' ? `display:flex;` : `display:inline-flex;`;
    const key = val === 'flex' ? `k-fx-display-flex` : `k-fx-display-inline;`;
    return this.coreTheme.setUpStyle(
      key, {
        '': () => (
          displayStyle
        )
      }
    );
  }

}
