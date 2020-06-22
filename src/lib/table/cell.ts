import { BooleanInput } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef, CdkFooterCell, CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

/**
 * Cell definition for the ly-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[lyCellDef]',
  providers: [{provide: CdkCellDef, useExisting: LyCellDef}]
})
export class LyCellDef extends CdkCellDef {}

/**
 * Header cell definition for the ly-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[lyHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: LyHeaderCellDef}]
})
export class LyHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the ly-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[lyFooterCellDef]',
  providers: [{provide: CdkFooterCellDef, useExisting: LyFooterCellDef}]
})
export class LyFooterCellDef extends CdkFooterCellDef {}

/**
 * Column definition for the ly-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[lyColumnDef]',
  inputs: ['sticky'],
  providers: [
    {provide: CdkColumnDef, useExisting: LyColumnDef},
    {provide: 'LY_SORT_HEADER_COLUMN_DEF', useExisting: LyColumnDef}
  ],
})
export class LyColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('lyColumnDef') name: string;

  static ngAcceptInputType_sticky: BooleanInput;
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'ly-header-cell, th[ly-header-cell]',
  host: {
    'class': 'ly-header-cell',
    'role': 'columnheader',
  },
})
export class LyHeaderCell extends CdkHeaderCell {
  constructor(columnDef: CdkColumnDef,
              elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`ly-column-${columnDef.cssClassFriendlyName}`);
  }
}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'ly-footer-cell, td[ly-footer-cell]',
  host: {
    'class': 'ly-footer-cell',
    'role': 'gridcell',
  },
})
export class LyFooterCell extends CdkFooterCell {
  constructor(columnDef: CdkColumnDef,
              elementRef: ElementRef) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`ly-column-${columnDef.cssClassFriendlyName}`);
  }
}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'ly-cell, td[ly-cell]',
  host: {
    'class': 'ly-cell',
    'role': 'gridcell',
  },
})
export class LyCell extends CdkCell {
  constructor(columnDef: CdkColumnDef,
              elementRef: ElementRef<HTMLElement>) {
    super(columnDef, elementRef);
    elementRef.nativeElement.classList.add(`ly-column-${columnDef.cssClassFriendlyName}`);
  }
}
