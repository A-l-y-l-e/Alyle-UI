import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsNestingComponent } from './ds-nesting.component';



@NgModule({
  declarations: [DsNestingComponent],
  imports: [
    CommonModule
  ],
  exports: [DsNestingComponent]
})
export class DsNestingModule { }
