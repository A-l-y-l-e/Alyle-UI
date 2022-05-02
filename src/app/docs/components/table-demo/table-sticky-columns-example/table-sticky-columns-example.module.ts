import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableStickyColumnsExampleComponent } from './table-sticky-columns-example.component';
import { LyTableModule } from '@alyle/ui/table';
import { LyIconModule } from '@alyle/ui/icon';



@NgModule({
  declarations: [
    TableStickyColumnsExampleComponent
  ],
  imports: [
    CommonModule,
    LyTableModule,
    LyIconModule
  ]
})
export class TableStickyColumnsExampleModule { }
