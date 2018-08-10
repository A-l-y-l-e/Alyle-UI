import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsBasicComponent } from './ds-basic.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [DsBasicComponent],
  declarations: [DsBasicComponent]
})
export class DsBasicModule { }
