import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { LyTable } from './table';
import {
  LyHeaderCellDef,
  LyColumnDef,
  LyCellDef,
  LyFooterCellDef,
  LyHeaderCell,
  LyCell,
  LyFooterCell
} from './cell';
import {
  LyHeaderRowDef,
  LyRowDef,
  LyFooterRowDef,
  LyHeaderRow,
  LyRow,
  LyFooterRow
} from './row';
import { LyTextColumn } from './text-column';


const EXPORTED_DECLARATIONS = [
  // Table
  LyTable,

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

  LyTextColumn,
];

@NgModule({
  declarations: [],
  imports: [
    CdkTableModule
  ],
  exports: [EXPORTED_DECLARATIONS]
})
export class LyTableModule { }
