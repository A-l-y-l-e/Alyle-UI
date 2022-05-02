import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFlexBasicExampleComponent } from './table-flex-basic-example.component';
import { LyTableModule } from '@alyle/ui/table';



@NgModule({
  declarations: [
    TableFlexBasicExampleComponent
  ],
  imports: [
    CommonModule,
    LyTableModule
  ]
})
export class TableFlexBasicExampleModule { }
