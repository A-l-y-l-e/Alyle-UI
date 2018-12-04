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
  classes = this.theme.addStyleSheet(styles, STYLE_PRIORITY);

  private _spacing: string | number;
  private _spacingClass: string;

  private _negativeMarginClass: string;

  private _justify: Justify;
  private _justifyClass: string;

  private _direction: Direction;
  private _directionClass: string;

  /**
   * Defines the space between the component with the `item` attribute.
   */
  @Input()
  get spacing(): string | number {
    return this._spacing;
  }
  set spacing(val: string | number) {
    if (val !== this.spacing) {
      this._spacing = val;
      this._spacingClass = this.theme.addStyle(`lyGrid-spacing:${val}`, (theme: ThemeVariables) => {
        if (typeof val === 'number') {
          return `padding:${val / 2}px;`;
        } else {
          const spacingStyles: {
            padding?: string
          } = {};
          eachMedia(val, (value, media, len) => {
            const padding = `${(+value) / 2}px`;
            if (len) {
              spacingStyles[theme.getBreakpoint(media)] = {
                padding
              };
            } else {
              spacingStyles.padding = padding;
            }
          });
          return spacingStyles as any;
        }
      }, undefined, undefined, STYLE_PRIORITY);
      this._negativeMarginClass = this.theme.addStyle(`lyGrid-negative-margin:${val}`, (theme: ThemeVariables) => {
        if (typeof val === 'number') {
          return `margin:${val / -2}px;width: calc(100% + ${val}px);`;
        } else {
          let negativeMarginStyles: {
            margin?: string
            width?: string
          };
          eachMedia(val, (value, media, len) => {
            const negativeMarginstyles = {
              margin: `${(-value) / 2}px`,
              width: `calc(100% + ${value}px)`
            };
            if (len) {
              if (!negativeMarginStyles) {
                negativeMarginStyles = {};
              }
              negativeMarginStyles[theme.getBreakpoint(media)] = negativeMarginstyles;
            } else {
              negativeMarginStyles = negativeMarginstyles;
            }
          });
          return negativeMarginStyles as any;
        }
      }, this.el.nativeElement, this._negativeMarginClass, STYLE_PRIORITY);
    }
  }

  /** @docs-private */
  get spacingClass() {
    return this._spacingClass;
  }

  /** Defines the justify-content style property. */
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
        return justifyStyles as any;
      }, this.el.nativeElement, this._justifyClass, STYLE_PRIORITY);
    }
  }

  /** Defines the justify-content style property. */
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
        return directionStyles as any;
      }, this.el.nativeElement, this._directionClass, STYLE_PRIORITY);
    }
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

  /** Defines the number of grids */
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
          return colStyles as any;
        }
      }, this.el.nativeElement, this._colClass, STYLE_PRIORITY);
    }
  }



  /** Defines the order style property. */
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
        return orderStyles as any;
      }, this.el.nativeElement, this._orderClass, STYLE_PRIORITY);
    }
  }

  constructor(
    private gridContainer: LyGrid,
    private el: ElementRef,
    private theme: LyTheme2
  ) {
    if (!gridContainer) {
      throw new Error(`Require parent grid`);
    }
  }

  ngOnInit() {
    this._updateSpacing();
  }

  private _updateSpacing() {
    if (this.gridContainer.spacingClass) {
      this.el.nativeElement.classList.add(this.gridContainer.spacingClass);
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
