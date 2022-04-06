import {Directive, Input} from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

/**
 * Cell definition for the ly-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[lyCellDef]',
  providers: [{provide: CdkCellDef, useExisting: LyCellDef}],
})
export class LyCellDef extends CdkCellDef {}

/**
 * Header cell definition for the ly-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[lyHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: LyHeaderCellDef}],
})
export class LyHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the ly-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[lyFooterCellDef]',
  providers: [{provide: CdkFooterCellDef, useExisting: LyFooterCellDef}],
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
    {provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: LyColumnDef},
  ],
})
export class LyColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('lyColumnDef')
  override get name(): string {
    return this._name;
  }
  override set name(name: string) {
    this._setNameInput(name);
  }

  /**
   * Add "ly-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "ly-column-" and columnCssClassName
   * will change from type string[] to string.
   * @docs-private
   */
  protected override _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName!.push(`ly-column-${this.cssClassFriendlyName}`);
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'ly-header-cell, th[ly-header-cell]',
  host: {
    'class': 'ly-header-cell',
    'role': 'columnheader',
  },
})
export class LyHeaderCell extends CdkHeaderCell {}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'ly-footer-cell, td[ly-footer-cell]',
  host: {
    'class': 'ly-footer-cell',
    'role': 'gridcell',
  },
})
export class LyFooterCell extends CdkFooterCell {}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'ly-cell, td[ly-cell]',
  host: {
    'class': 'ly-cell',
    'role': 'gridcell',
  },
})
export class LyCell extends CdkCell {}
