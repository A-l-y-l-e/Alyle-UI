import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumnStylingExampleComponent } from './table-column-styling-example.component';
import { LyTableModule } from '@alyle/ui/table';



@NgModule({
  declarations: [
    TableColumnStylingExampleComponent
  ],
  imports: [
    CommonModule,
    LyTableModule
  ]
})
export class TableColumnStylingExampleModule { }
