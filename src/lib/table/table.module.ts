import {NgModule} from '@angular/core';
import {LyRecycleRows, LyTable} from './table';
import {CdkTableModule} from '@angular/cdk/table';
import {
  LyCell,
  LyCellDef,
  LyColumnDef,
  LyFooterCell,
  LyFooterCellDef,
  LyHeaderCell,
  LyHeaderCellDef,
} from './cell';
import {
  LyFooterRow,
  LyFooterRowDef,
  LyHeaderRow,
  LyHeaderRowDef,
  LyRow,
  LyRowDef,
  LyNoDataRow,
} from './row';
import {LyTextColumn} from './text-column';
import {LyCommonModule} from '@alyle/ui';

const EXPORTED_DECLARATIONS = [
  // Table
  LyTable,
  LyRecycleRows,

  // Template defs
  LyHeaderCellDef,
  LyHeaderRowDef,
  LyColumnDef,
  LyCellDef,
  LyRowDef,
  LyFooterCellDef,
  LyFooterRowDef,

  // Cell directives
  LyHeaderCell,
  LyCell,
  LyFooterCell,

  // Row directives
  LyHeaderRow,
  LyRow,
  LyFooterRow,
  LyNoDataRow,

  LyTextColumn,
];

@NgModule({
  imports: [CdkTableModule, LyCommonModule],
  exports: [LyCommonModule, EXPORTED_DECLARATIONS],
  declarations: EXPORTED_DECLARATIONS,
})
export class LyTableModule {}
