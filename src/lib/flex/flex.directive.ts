import { Directive, Input, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
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
export type FxWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FxFlow = FxDirection | FxWrap;
export type FxJustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | null;
export type FxAlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | null;
export type FxAlignContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch' | null;
export type FxAlignItemsAndContent = 'start' | 'center' | 'end' | 'stretch' | null;

export type FxAlign = [FxJustifyContent] | [FxJustifyContent, FxAlignItemsAndContent] | [FxJustifyContent, FxAlignItems, FxAlignContent];

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fxDisplay], [fxDirection], [fxWrap], [fxAlign]'
})
export class LyFlex implements OnChanges {
  private _fxDisplay: 'flex' | 'inline';
  private _fxDisplayClass: string;
  private _fxAlignX: string;
  private _fxAlign: FxAlign;
  private _fxDirectionX: string;
  private _fxDirection: FxDirection;
  private _fxWrapX: string;
  private _fxWrap: FxWrap;
  private _currentClassname: string;

  @Input()
  set fxDisplay(val: 'flex' | 'inline') {
    if (this._fxDisplay !== val) {
      this._fxDisplay = val || 'flex';
      const beforeDisplayClass = this._fxDisplayClass;
      this._fxDisplayClass = this._createDisplay(this._fxDisplay);
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, this._fxDisplayClass, beforeDisplayClass);
    }
  }
  get fxDisplay() {
    return this._fxDisplay;
  }

  @Input()
  set fxAlign(val: FxAlign) {
    if (this._fxAlign !== val) {
      this._fxAlign = val;
      const justifyContent = __align[val[0]] || 'flex-start';
      const alignItems = __align[val[1]] || 'stretch';
      const alignContent = __align[val[2]];
      this._fxAlignX = (
        `justify-content:${justifyContent};` +
        `align-items:${alignItems};` +
        `align-content:${alignContent || alignItems};`
      );
    }
  }
  get fxAlign() {
    return this._fxAlign;
  }

  @Input()
  set fxDirection(val: FxDirection) {
    if (this._fxDirection !== val) {
      this._fxDirection = val;
      this._fxDirectionX = `flex-direction:${__align[val] || 'row'};`;
    }
  }
  get fxDirection() {
    return this._fxDirection;
  }

  @Input()
  set fxWrap(val: FxWrap) {
    if (this._fxWrap !== val) {
      this._fxWrap = val;
      this._fxWrapX = `flex-wrap:${__align[val] || 'nowrap'};`;
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
    let key = '';
    let styles = ``;
    if (this.fxAlign) {
      key += `fxAlign${this.fxAlign}`;
      styles += this._fxAlignX;
    }
    if (this.fxDirection) {
      key += `fxDirection${this.fxDirection}`;
      styles += this._fxDirectionX;
    }
    if (this.fxWrap) {
      key += `fxWrap${this.fxWrap}`;
      styles += this._fxWrapX;
    }
    if (!this._fxDisplayClass) {
      /** Set default display */
      this.fxDisplay = null;
    }
    if (key) {
      const classname = this.coreTheme.setUpStyle(key, {
        '': () => (
          styles
        )
      });
      this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, classname, this._currentClassname);
      this._currentClassname = classname;
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
