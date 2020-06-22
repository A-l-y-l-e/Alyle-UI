import { CDK_TABLE_TEMPLATE, CdkTable, CDK_TABLE} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  selector: 'ly-table, table[ly-table]',
  exportAs: 'lyTable',
  template: CDK_TABLE_TEMPLATE,
  host: {
    'class': 'ly-table',
  },
  providers: [
    {provide: CdkTable, useExisting: LyTable},
    {provide: CDK_TABLE, useExisting: LyTable}
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LyTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected stickyCssClass = 'ly-table-sticky';
}
