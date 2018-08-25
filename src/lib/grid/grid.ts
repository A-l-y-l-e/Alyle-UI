import { Directive, ElementRef, Input, Optional, Inject, OnInit } from '@angular/core';
import { LyTheme2, eachMedia } from '@alyle/ui';
import { LY_MEDIA_QUERIES } from '@alyle/ui/responsive';

const COL_VALUES = { };

const styles = ({
  root: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box'
  }
});

/**
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
  classes = this.theme.addStyleSheet(styles, 'lyGrid');
  private _spacing: string | number;
  private _spacingClass: string;
  private _negativeMarginClass: string;

  /**
   * example:
   * <ly-grid container spacing="24 8@Small@XSmal">
   */
  @Input()
  set spacing(val: string | number) {
    if (val !== this.spacing) {
      this._spacing = val;
      this._spacingClass = this.theme.addStyle(`lyGrid-spacing:${val}`, () => {
        if (typeof val === 'number') {
          return `padding:${val / 2}px;`;
        } else {
          const spacingStyles: {
            padding?: string
          } = {};
          eachMedia(val, (value, media, len) => {
            const padding = `${(+value) / 2}px`;
            if (len) {
              spacingStyles[`@media ${this.mediaQueries[media]}`] = {
                padding
              };
            } else {
              spacingStyles.padding = padding;
            }
          });
          return spacingStyles as any;
        }
      });
      this._negativeMarginClass = this.theme.addStyle(`lyGrid-negative-margin:${val}`, () => {
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
              negativeMarginStyles[`@media ${this.mediaQueries[media]}`] = negativeMarginstyles;
            } else {
              negativeMarginStyles = negativeMarginstyles;
            }
          });
          return negativeMarginStyles as any;
        }
      }, this.elementRef.nativeElement, this._negativeMarginClass);
    }
  }
  get spacing() {
    return this._spacing;
  }
  get spacingClass() {
    return this._spacingClass;
  }

  constructor(
    @Optional() @Inject(LY_MEDIA_QUERIES) private mediaQueries: any,
    private theme: LyTheme2,
    private elementRef: ElementRef,
  ) {
    this.elementRef.nativeElement.classList.add(this.classes.root);
  }
}

@Directive({
  selector: 'ly-grid[item]'
})
export class LyGridCol implements OnInit {
  private _col: string | number;
  private _colClass: string;

  @Input()
  set col(val: string | number) {
    if (val !== this.col) {
      this._colClass = this.theme.addStyle(`lyGrid-negative-margin:${val}`, () => {
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
              colStyles[`@media ${this.mediaQueries[media]}`] = newColStyles;
            } else {
              colStyles = newColStyles;
            }
          });
          return colStyles as any;
        }
      }, this.el.nativeElement, this._colClass);
    }
  }
  get col() {
    return this._col;
  }

  constructor(
    @Optional() @Inject(LY_MEDIA_QUERIES) private mediaQueries: any,
    private gridContainer: LyGrid,
    private el: ElementRef,
    private theme: LyTheme2
  ) {
    if (!gridContainer) {
      throw new Error(`Rquire`);
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
