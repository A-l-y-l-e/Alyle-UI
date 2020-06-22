import {BooleanInput} from '@angular/cdk/coercion';
import {
  CDK_ROW_TEMPLATE,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef
} from '@angular/cdk/table';
import {ChangeDetectionStrategy, Component, Directive, ViewEncapsulation} from '@angular/core';

/**
 * Header row definition for the ly-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[lyHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: LyHeaderRowDef}],
  inputs: ['columns: lyHeaderRowDef', 'sticky: lyHeaderRowDefSticky'],
})
export class LyHeaderRowDef extends CdkHeaderRowDef {
  static ngAcceptInputType_sticky: BooleanInput;
}

/**
 * Footer row definition for the ly-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[lyFooterRowDef]',
  providers: [{provide: CdkFooterRowDef, useExisting: LyFooterRowDef}],
  inputs: ['columns: lyFooterRowDef', 'sticky: lyFooterRowDefSticky'],
})
export class LyFooterRowDef extends CdkFooterRowDef {
  static ngAcceptInputType_sticky: BooleanInput;
}

/**
 * Data row definition for the ly-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[lyRowDef]',
  providers: [{provide: CdkRowDef, useExisting: LyRowDef}],
  inputs: ['columns: lyRowDefColumns', 'when: lyRowDefWhen'],
})
export class LyRowDef<T> extends CdkRowDef<T> {
}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ly-header-row, tr[ly-header-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'ly-header-row',
    'role': 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyHeaderRow',
  providers: [{provide: CdkHeaderRow, useExisting: LyHeaderRow}],
})
export class LyHeaderRow extends CdkHeaderRow {
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ly-footer-row, tr[ly-footer-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'ly-footer-row',
    'role': 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyFooterRow',
  providers: [{provide: CdkFooterRow, useExisting: LyFooterRow}],
})
export class LyFooterRow extends CdkFooterRow {
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ly-row, tr[ly-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'class': 'ly-row',
    'role': 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyRow',
  providers: [{provide: CdkRow, useExisting: LyRow}],
})
export class LyRow extends CdkRow {
}
