import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';
import { LyTypographyModule } from '@alyle/ui/typography';

import { BasicSelectComponent } from './basic-select.component';

@NgModule({
  declarations: [BasicSelectComponent],
  imports: [
    CommonModule,
    LyFieldModule,
    LySelectModule,
    LyTypographyModule
  ],
  exports: [BasicSelectComponent]
})
export class BasicSelectModule { }
