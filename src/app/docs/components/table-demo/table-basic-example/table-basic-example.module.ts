import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyTableModule } from '@alyle/ui/table';

import { TableBasicExampleComponent } from './table-basic-example.component';



@NgModule({
  declarations: [
    TableBasicExampleComponent
  ],
  imports: [
    CommonModule,
    LyTableModule
  ],
  exports: [
    TableBasicExampleComponent
  ]
})
export class TableBasicExampleModule { }
