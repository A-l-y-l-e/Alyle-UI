import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyExpansionModule } from '@alyle/ui/expansion';

import { BasicExpansionComponent } from './basic-expansion.component';

@NgModule({
  declarations: [BasicExpansionComponent],
  imports: [
    CommonModule,
    LyExpansionModule
  ],
  exports: [BasicExpansionComponent]
})
export class BasicExpansionModule { }
