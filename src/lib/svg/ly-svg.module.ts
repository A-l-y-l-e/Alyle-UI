import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LySvgComponent } from './ly-svg.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LySvgComponent],
  declarations: [LySvgComponent]
})
export class LySvgModule { }
