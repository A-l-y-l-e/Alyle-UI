import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTableModule } from '@alyle/ui/table';

import { TableFooterRowExampleComponent } from './table-footer-row-example.component';



@NgModule({
  declarations: [
    TableFooterRowExampleComponent
  ],
  imports: [
    CommonModule,
    LyTableModule
  ]
})
export class TableFooterRowExampleModule { }
