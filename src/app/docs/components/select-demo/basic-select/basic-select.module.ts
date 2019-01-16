import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyFieldModule } from '@alyle/ui/field';

import { BasicSelectComponent } from './basic-select.component';

@NgModule({
  declarations: [BasicSelectComponent],
  imports: [
    CommonModule,
    LyFieldModule
  ],
  exports: [BasicSelectComponent]
})
export class BasicSelectModule { }
