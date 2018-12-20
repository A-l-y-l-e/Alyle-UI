import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyListModule } from '@alyle/ui/list';
import { LyDividerModule } from '@alyle/ui/divider';

import { ListDividersComponent } from './list-dividers.component';

@NgModule({
  imports: [
    CommonModule,
    LyListModule,
    LyDividerModule
  ],
  exports: [ListDividersComponent],
  declarations: [ListDividersComponent]
})
export class ListDividersModule { }
