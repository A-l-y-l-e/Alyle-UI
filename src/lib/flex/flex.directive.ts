import { Directive, Input, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
import { CoreTheme } from '@alyle/ui';

enum __align {
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
export type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type Flow = Direction | Wrap;
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
export type AlignItemsAndContent = 'flex-start' | 'center' | 'flex-end' | 'stretch';

export type FxAlign = [JustifyContent] | [JustifyContent, AlignItemsAndContent] | [JustifyContent, AlignItems, AlignContent];

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[fxDirection], [fxWrap], [fxAlign], [fxInline]'
})
export class LyFlex implements OnChanges {
  private _fxDirection: string;
  private _fxWrap: string;
  private _fxAlign: string;
  private _currentClassname: string;
  private _display = 'flex';
  @Input()
  set fxInline(val: any) {
    this._display = 'inline-flex';
  }
  @Input()
  set fxAlign(val: FxAlign) {
    const justifyContent = __align[val[0]] || 'flex-start';
    const alignItems = __align[val[1]] || 'stretch';
    const alignContent = __align[val[2]];
    this._fxAlign = (
      `justify-content:${justifyContent};` +
      `align-items:${alignItems};` +
      `align-content:${alignContent || alignItems};`
    );
  }
  @Input()
  set fxDirection(val: Direction) {
    this._fxDirection = `flex-direction:${val || 'row'};`;
  }
  @Input() fxWrap: Wrap;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private coreTheme: CoreTheme
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    let key = '';
    let styles = ``;

    // if (changes.fxInline) {
    //   key += `fxInline${changes.fxInline.currentValue}`;
    //   styles += this._display || '';
    // }
    if (changes.fxAlign) {
      key += `fxAlign${changes.fxAlign.currentValue}`;
      styles += this._fxAlign || '';
    }
    if (changes.fxDirection) {
      key += `fxDirection${changes.fxDirection.currentValue}`;
      styles += this.fxDirection || '';
    }
    const classname = this.coreTheme.setUpStyle(key, {
      '': () => (
        `display:${this._display};` +
        styles
      )});
    this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, classname, this._currentClassname);
  }

}
