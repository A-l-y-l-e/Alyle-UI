import {
  CDK_ROW_TEMPLATE,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkNoDataRow,
} from '@angular/cdk/table';
import {ChangeDetectionStrategy, Component, Directive, TemplateRef, ViewEncapsulation} from '@angular/core';
import { StyleRenderer } from '@alyle/ui';
import { STYLES as TABLE_STYLES } from './styles';

/**
 * Header row definition for the ly-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[lyHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: LyHeaderRowDef}],
  inputs: ['columns: lyHeaderRowDef', 'sticky: lyHeaderRowDefSticky'],
  standalone: false
})
export class LyHeaderRowDef extends CdkHeaderRowDef {}

/**
 * Footer row definition for the ly-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[lyFooterRowDef]',
  providers: [{provide: CdkFooterRowDef, useExisting: LyFooterRowDef}],
  inputs: ['columns: lyFooterRowDef', 'sticky: lyFooterRowDefSticky'],
  standalone: false
})
export class LyFooterRowDef extends CdkFooterRowDef {}

/**
 * Data row definition for the ly-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[lyRowDef]',
  providers: [{provide: CdkRowDef, useExisting: LyRowDef}],
  inputs: ['columns: lyRowDefColumns', 'when: lyRowDefWhen'],
  standalone: false
})
export class LyRowDef<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ly-header-row, tr[ly-header-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'role': 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyHeaderRow',
  providers: [
    {provide: CdkHeaderRow, useExisting: LyHeaderRow},
    StyleRenderer
  ],
  standalone: false
})
export class LyHeaderRow extends CdkHeaderRow {
  readonly classes = this.sRenderer.renderSheet(TABLE_STYLES, 'headerRow');
  constructor(
    readonly sRenderer: StyleRenderer
  ) {
    super();
  }
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ly-footer-row, tr[ly-footer-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'role': 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyFooterRow',
  providers: [
    {provide: CdkFooterRow, useExisting: LyFooterRow},
    StyleRenderer
  ],
  standalone: false
})
export class LyFooterRow extends CdkFooterRow {
  readonly classes = this.sRenderer.renderSheet(TABLE_STYLES, 'footerRow');
  constructor(
    readonly sRenderer: StyleRenderer
  ) {
    super();
  }
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ly-row, tr[ly-row]',
  template: CDK_ROW_TEMPLATE,
  host: {
    'role': 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'lyRow',
  providers: [
    {provide: CdkRow, useExisting: LyRow},
    StyleRenderer
  ],
  standalone: false
})
export class LyRow extends CdkRow {
  readonly classes = this.sRenderer.renderSheet(TABLE_STYLES, 'row');
  constructor(
    readonly sRenderer: StyleRenderer
  ) {
    super();
  }
}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
  selector: 'ng-template[lyNoDataRow]',
  providers: [
    {provide: CdkNoDataRow, useExisting: LyNoDataRow},
    StyleRenderer
  ],
  standalone: false
})
export class LyNoDataRow extends CdkNoDataRow {
  readonly classes = this.sRenderer.renderSheet(TABLE_STYLES);
  override _contentClassName = this.classes.noDataRow;
  constructor(
    templateRef: TemplateRef<any>,
    readonly sRenderer: StyleRenderer
  ) {
    super(templateRef);
  }
}
