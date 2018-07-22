import { Directive, Input, Renderer2, ElementRef, Inject, Optional, AfterContentInit } from '@angular/core';
import { CoreTheme } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '@alyle/ui/responsive';
import { LyFlexBase } from './flex-base';

const GridDefaultValue = '100%';

const __grid = {
  0: null,
  1: '8.333333333333334%',
  2: '16.666666666666668%',
  3: '25%',
  4: '33.333333333333336%',
  5: '41.66666666666667%',
  6: '50%',
  7: '58.333333333333336%',
  8: '66.66666666666667%',
  9: '75%',
  10: '83.33333333333334%',
  11: '91.66666666666667%',
  12: GridDefaultValue
};

/**
 * <grid>
 *   ...
 * </grid>
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'grid:not(grid[col])',
  exportAs: 'lyGrid'
})
export class LyGrid extends LyFlexBase {
  private _gutter: number;
  private _gutterClass: string;
  private _negativeMarginClass: string;
  rootClass = this._coreTheme.setUpStyleSecondary('k-grid', (
    `width: 100%;` +
    `display:flex;` +
    `flex-wrap:wrap;` +
    `box-sizing:border-box;`
  ));

  @Input()
  set gutter(val: number) {
    if (this.gutter !== val) {
      /** create style */
      const newClass = this._createGutterClass(val, val);
      this._gutterClass = newClass;
      const newNegativeMarginClass = this._createNegativeMarginClass(val, val);
      this._updateClass(newNegativeMarginClass, this._negativeMarginClass);
      this._negativeMarginClass = newNegativeMarginClass;
    }
  }
  get gutter() {
    return this._gutter;
  }
  get gutterClass() {
    return this._gutterClass;
  }

  constructor(
    @Optional() @Inject(LY_MEDIA_QUERIES) mediaQueries: any,
    elementRef: ElementRef,
    renderer: Renderer2,
    coreTheme: CoreTheme,
  ) {
    super(elementRef, renderer, coreTheme, mediaQueries);
    renderer.addClass(elementRef.nativeElement, this.rootClass);
  }

  /** create padding for childs */
  private _createGutterClass(key: number, val: number, media?: string) {
    this._gutter = val || 16;
    const newKey = `k-gridGutter:${key || this.gutter}`;
    return this._coreTheme.setUpStyle(newKey,
      () => {
        const padding = val / 2;
        return (
          `padding:${padding}px;`
        );
      },
      media
    );
  }
  private _createNegativeMarginClass(key: number, val: number, media?: string) {
    this._gutter = val || 16;
    const newKey = `k-gridNegativeMargin:${key || this.gutter}`;
    return this._coreTheme.setUpStyle(newKey,
      () => {
        const padding = val / -2;
        return (
          `margin:${padding}px;` +
          `width: calc(100% + ${this.gutter}px);`
        );
      },
      media
    );
  }
}

/**
 * examples:
 *
 * <grid>
 *   <div col="9" colMedia="auto Small"></div>
 *   <div col="auto"></div>
 * </grid>
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'grid[col]',
  exportAs: 'lyGridItem'
})
export class LyGridCol extends LyFlexBase implements AfterContentInit {
  private _col: string;
  private _colClass: string;
  colVal: string;

  private _gutterClass: string;

  private _rawClass: string[];

  @Input()
  set col(val: string | string[]) {
    if (this.col !== val) {
      // /** create Style */
      // const newClass = this._createColClass(val, val);
      // this._updateClass(newClass, this._colClass);
      // this._colClass = newClass;
      if (!this._rawClass) {
        this._rawClass = [];
      }

      /** Save previous classes  */
      const prevClasses = this._rawClass;

      /** Clear rawClass */
      if (this._rawClass.length) {
        this._rawClass = [];
      }

      const valArray = typeof val === 'string' ? val.split(' ') : val;
      valArray.forEach(key => {
        let newClass;
        const values = key.split('@');
        newClass = this._createColClass(key, values[0] as any, this._mediaQueries[(values[1])]);
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
  }

  get col() {
    return this._col;
  }

  constructor(
    @Optional() @Inject(LY_MEDIA_QUERIES) mediaQueries: any,
    public gridContainer: LyGrid,
    elementRef: ElementRef,
    renderer: Renderer2,
    coreTheme: CoreTheme,
  ) {
    super(elementRef, renderer, coreTheme, mediaQueries);
  }

  ngAfterContentInit() {
    /** apply gutter class if exists */
    if (this.gridContainer.gutter) {
      const newClass = this.gridContainer.gutterClass;
      this._updateClass(newClass, this._gutterClass);
      this._gutterClass = newClass;
    }
  }

  private _createColClass(key: string, val: string, media?: string) {
    this.colVal = val || null;
    const newKey = `k-gridCol:${key || this.colVal}`;
    /** create Style */
    return this._coreTheme.setUpStyle(newKey,
      () => {
        if (this.colVal) {
          const newVal = __grid[this.colVal];
          return (
            `max-width:${newVal};` +
            `flex-basis:${newVal};` +
            `flex-grow:0;`
          );
        } else {
          return (
            `max-width:100%;` +
            `flex-basis:0;` +
            `flex-grow:1;`
          );
        }
      },
      media
    );
  }
}
