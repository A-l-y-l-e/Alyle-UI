import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { LyButtonModule } from '@alyle/ui/button';

import { BasicExpansionComponent } from './basic-expansion.component';

@NgModule({
  declarations: [BasicExpansionComponent],
  imports: [
    CommonModule,
    LyExpansionModule,
    LyButtonModule
  ],
  exports: [BasicExpansionComponent]
})
export class BasicExpansionModule { }
