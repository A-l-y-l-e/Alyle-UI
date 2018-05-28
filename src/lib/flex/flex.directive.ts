import { Directive, Input, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
import { LyFlexService } from './flex.service';
import { LNodeType } from '@angular/core/src/render3/interfaces/node';
import { CoreTheme } from '@alyle/ui';

export type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type Flow = Direction | Wrap;
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
export type AlignItemsAndContent = 'flex-start' | 'center' | 'flex-end' | 'stretch';

export type FxAlign = [JustifyContent] | [JustifyContent, AlignItemsAndContent] | [JustifyContent, AlignItems, AlignContent];

@Directive({
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
    const justifyContent = val[0] || 'flex-start';
    const alignItems = val[1] || 'stretch';
    const alignContent = val[2];
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
    // tslint:disable-next-line:forin
    for (const inputKey in changes) {
      key += inputKey + changes[inputKey].currentValue;
      styles += this[`_${inputKey}`] || '';
    }
    // const inputs = Object.keys(changes);
    // for (let index = 0; index < inputs.length; index++) {
    //   const inputKey = inputs[index];
    //   key += inputKey + changes[inputKey].currentValue;
    //   styles += this[`_${inputKey}`] || '';
    // }
    const classname = this.coreTheme.setUpStyle(key, {
      '': () => (
        `display:${this._display};` +
        styles
      )});
    this.coreTheme.updateClassName(this.elementRef.nativeElement, this.renderer, classname, this._currentClassname);
  }

}
