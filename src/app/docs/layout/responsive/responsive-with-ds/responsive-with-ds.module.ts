import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { ResponsiveWithDsComponent } from './responsive-with-ds.component';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [ResponsiveWithDsComponent],
  declarations: [ResponsiveWithDsComponent]
})
export class ResponsiveWithDsModule { }
