import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';

import { BasicSelectComponent } from './basic-select.component';

@NgModule({
  declarations: [BasicSelectComponent],
  imports: [
    CommonModule,
    LyFieldModule,
    LySelectModule,
  ],
  exports: [BasicSelectComponent]
})
export class BasicSelectModule { }
