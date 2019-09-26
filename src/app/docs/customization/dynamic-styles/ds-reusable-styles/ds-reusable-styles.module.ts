import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsReusableStylesComponent } from './ds-reusable-styles.component';



@NgModule({
  declarations: [DsReusableStylesComponent],
  imports: [
    CommonModule
  ],
  exports: [DsReusableStylesComponent]
})
export class DsReusableStylesModule { }
