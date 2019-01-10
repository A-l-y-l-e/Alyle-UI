import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { LyTheme2, eachMedia, ThemeVariables } from '@alyle/ui';

const STYLE_PRIORITY = -1;

/** @docs-private */
const COL_VALUES = { };

const ALIGN_ALIAS = {
  rowReverse: 'row-reverse',
  columnReverse: 'column-reverse',
  wrapReverse: 'wrap-reverse',
  start: 'flex-start',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

const styles = ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box'
  }
});

export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type Direction = 'row' | 'rowReverse' | 'column' | 'columnReverse';

/**
 * Grid container
 * example:
 * <ly-grid container [spacing]="'16 8@XSmall'">
 *   <ly-grid item [col]="'6 12@XSmall'">
 *     <div>6 12@XSmall</div>
 *   </ly-grid>
 *   <ly-grid item [col]="'6 12@XSmall'">
 *     <div>6 12@XSmall</div>
 *   </ly-grid>
 * </ly-grid>
 */
@Directive({
  selector: 'ly-grid[container]'
})
export class LyGrid {
  /**
   * Styles
   * @docs-private
   */
  readonly classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);

  private _spacing: string | number;
  _spacingClass?: string;

  private _spacingX: string | number;
  _spacingXClass?: string;

  private _spacingY: string | number;
  _spacingYClass?: string;


  private _negativeMarginClass?: string;

  private _justify: Justify;
  private _justifyClass?: string;

  private _direction: Direction;
  private _directionClass?: string;

  private _alignItems: AlignItems;
  private _alignItemsClass?: string;

  @Input()
  get spacingX(): string | number {
    return this._spacingX;
  }
  set spacingX(val: string | number) {
    if (val !== this.spacingX) {
      this._spacingX = val;
      this._createSpacingClass(undefined, val);
    }
  }

  @Input()
  get spacingY(): string | number {
    return this._spacingY;
  }
  set spacingY(val: string | number) {
    if (val !== this.spacingY) {
      this._spacingY = val;
      this._createSpacingClass(undefined, undefined, val);
    }
  }

  /**
   * Defines the space between the component with the `item` attribute.
   * Support breakpoints
   */
  @Input()
  get spacing(): string | number {
    return this._spacing;
  }
  set spacing(val: string | number) {
    if (val !== this.spacing) {
      this._spacing = val;
      this._createSpacingClass(val);
    }
  }

  /**
   * Only one param must be defined
   */
  private _createSpacingClass(xy?: string | number, x?: string | number, y?: string | number) {
    const newSpacingClass = this.theme.addStyle(`lyGrid-spacing:${xy}·${x}·${y}`, (theme: ThemeVariables) => {
      const val = xy || x || y;
      const spacingStyles: {
        padding?: string
      } = {};
      eachMedia(val, (value, media) => {
        const valuePadding = `${(+value) / 2}px`;
        const padding = xy != null
          ? valuePadding
          : x != null
            ? `0 ${valuePadding}`
            : `${valuePadding} 0`;
        if (media) {
          spacingStyles[theme.getBreakpoint(media)] = {
            padding
          };
        } else {
          spacingStyles.padding = padding;
        }
      });
      return spacingStyles;
    }, undefined, undefined, STYLE_PRIORITY);

    if (xy) {
      this._spacingClass = newSpacingClass;
    } else {
      if (x) {
        this._spacingXClass = newSpacingClass;
      }
      if (y) {
        this._spacingYClass = newSpacingClass;
      }
    }

    this._negativeMarginClass = this.theme.addStyle(`lyGrid-negative-margin:${xy}·${x}·${y}`, (theme: ThemeVariables) => {
      const val = xy || x || y;
      let negativeMarginStyles: {
        margin?: string
        width?: string
      };
      eachMedia(val, (value, media, len) => {
        const valueMargin = `${(-value) / 2}px`;
        const margin = xy != null
          ? valueMargin
          : x != null
            ? `0 ${valueMargin}`
            : `${valueMargin} 0`;
        const negativeMarginstyles: {
          margin: string
          width?: string
        } = { margin };

        if (xy != null || x != null) {
          negativeMarginstyles.width = `calc(100% + ${value}px)`;
        }
        if (len) {
          if (!negativeMarginStyles) {
            negativeMarginStyles = {};
          }
          negativeMarginStyles[theme.getBreakpoint(media)] = negativeMarginstyles;
        } else {
          negativeMarginStyles = negativeMarginstyles;
        }
      });
      return negativeMarginStyles!;
    }, this.el.nativeElement, this._negativeMarginClass, STYLE_PRIORITY);
  }

  /**
   * Defines the justify-content style property.
   * Support breakpoints
   */
  @Input()
  get justify(): Justify {
    return this._justify;
  }
  set justify(val: Justify) {
    if (val !== this.justify) {
      this._justify = val;
      this._justifyClass = this.theme.addStyle(`lyGrid-justify:${val}`, (theme: ThemeVariables) => {
        let justifyStyles: {
          justifyContent?: string
        };
        eachMedia(val, (value, media, isMedia) => {
          const newJustifyStyles = {
            justifyContent: value in ALIGN_ALIAS
            ? ALIGN_ALIAS[value]
            : value
          };
          if (isMedia) {
            if (!justifyStyles) {
              justifyStyles = {};
            }
            justifyStyles[theme.getBreakpoint(media)] = newJustifyStyles;
          } else {
            justifyStyles = newJustifyStyles;
          }
        });
        return justifyStyles!;
      }, this.el.nativeElement, this._justifyClass, STYLE_PRIORITY);
    }
  }

  /**
   * Defines the justify-content style property.
   * Support breakpoints
   */
  @Input()
  get direction(): Direction {
    return this._direction;
  }
  set direction(val: Direction) {
    if (val !== this.direction) {
      this._direction = val;
      this._directionClass = this.theme.addStyle(`lyGrid-direction:${val}`, (theme: ThemeVariables) => {
        let directionStyles: {
          flexDirection?: string
        };
        eachMedia(val, (value, media, isMedia) => {
          const newDirectionStyles = {
            flexDirection: value in ALIGN_ALIAS
            ? ALIGN_ALIAS[value]
            : value
          };
          if (isMedia) {
            if (!directionStyles) {
              directionStyles = {};
            }
            directionStyles[theme.getBreakpoint(media)] = newDirectionStyles;
          } else {
            directionStyles = newDirectionStyles;
          }
        });
        return directionStyles!;
      }, this.el.nativeElement, this._directionClass, STYLE_PRIORITY);
    }
  }

  /**
   * Defines the `align-items` style property.
   * Support breakpoints
   */
  @Input()
  set alignItems(val: AlignItems) {
    this._alignItems = val;
    this._alignItemsClass = this.theme.addStyle(`lyGrid.align:${val}`, (theme: ThemeVariables) => {
      let alignItemsStyles: {
        alignItems?: string,
        [media: string]: {
          alignItems?: string
        } | string | undefined
      };
      eachMedia(val, (value, media, isMedia) => {
        const newAlignItemsStyles = {
          alignItems: value in ALIGN_ALIAS
          ? ALIGN_ALIAS[value]
          : value
        };
        if (isMedia) {
          if (!alignItemsStyles) {
            alignItemsStyles = {};
          }
          alignItemsStyles[theme.getBreakpoint(media)] = newAlignItemsStyles;
        } else {
          alignItemsStyles = newAlignItemsStyles;
        }
      });
      return alignItemsStyles!;
    }, this.el.nativeElement, this._alignItemsClass, STYLE_PRIORITY);
  }
  get alignItems() {
    return this._alignItems;
  }

  constructor(
    private theme: LyTheme2,
    private el: ElementRef,
  ) {
    this.el.nativeElement.classList.add(this.classes.root);
  }
}

@Directive({
  selector: 'ly-grid[item]'
})
export class LyGridItem implements OnInit {
  private _col: string | number;
  private _colClass: string;

  private _order: string | number;
  private _orderClass: string;

  /**
   * Defines the number of grids
   * Support breakpoints
   */
  @Input()
  get col(): string | number {
    return this._col;
  }
  set col(val: string | number) {
    if (val !== this.col) {
      this._col = val;
      this._colClass = this.theme.addStyle(`lyGrid-col:${val}`, (theme: ThemeVariables) => {
        if (typeof val === 'number') {
          return getColStyle(val);
        } else {
          let colStyles: {
            maxWidth?: string | number
            flexBasis?: string | number
            flexGrow?: number
          };
          eachMedia(val, (value, media, len) => {
            const newColStyles = getColStyle(+value);
            if (len) {
              if (!colStyles) {
                colStyles = {};
              }
              colStyles[theme.getBreakpoint(media)] = newColStyles;
            } else {
              colStyles = newColStyles;
            }
          });
          return colStyles!;
        }
      }, this.el.nativeElement, this._colClass, STYLE_PRIORITY);
    }
  }



  /**
   * Defines the order style property.
   * Support breakpoints
   */
  @Input()
  get order(): string | number {
    return this._order;
  }
  set order(val: string | number) {
    if (val !== this.order) {
      this._order = val;
      this._orderClass = this.theme.addStyle(`lyGrid-order:${val}`, (theme: ThemeVariables) => {
        let orderStyles: {
          order?: string
        };
        eachMedia(`${val}`, (value, media, isMedia) => {
          const newOrderStyles = {
            order: value
          };
          if (isMedia) {
            if (!orderStyles) {
              orderStyles = {};
            }
            orderStyles[theme.getBreakpoint(media)] = newOrderStyles;
          } else {
            orderStyles = newOrderStyles;
          }
        });
        return orderStyles!;
      }, this.el.nativeElement, this._orderClass, STYLE_PRIORITY);
    }
  }

  constructor(
    private gridContainer: LyGrid,
    private el: ElementRef,
    private theme: LyTheme2
  ) {
    if (!gridContainer) {
      throw new Error(`Require parent <ly-grid container>`);
    }
  }

  ngOnInit() {
    this._updateSpacing();
  }

  private _updateSpacing() {
    if (this.gridContainer._spacingClass) {
      this.el.nativeElement.classList.add(this.gridContainer._spacingClass);
    } else {
      if (this.gridContainer._spacingXClass) {
        this.el.nativeElement.classList.add(this.gridContainer._spacingXClass);
      }
      if (this.gridContainer._spacingYClass) {
        this.el.nativeElement.classList.add(this.gridContainer._spacingYClass);
      }
    }
  }

}

function getColStyle(val: number) {
  return {
    maxWidth: val ? getColVal(val) : '100%',
    flexBasis: val ? getColVal(val) : 0,
    flexGrow: val ? 0 : 1
  };
}

function getColVal(val: string | number): string {
  return val in COL_VALUES
              ? COL_VALUES[val]
              : COL_VALUES[val] = `${+val * 100 / 12}%`;
}
