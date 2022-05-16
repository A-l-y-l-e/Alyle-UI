import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTableModule } from '@alyle/ui/table';

import { TableUsingNgForExampleComponent } from './table-using-ng-for-example.component';



@NgModule({
  declarations: [
    TableUsingNgForExampleComponent
  ],
  imports: [
    CommonModule,
    LyTableModule
  ]
})
export class TableUsingNgForExampleModule { }
