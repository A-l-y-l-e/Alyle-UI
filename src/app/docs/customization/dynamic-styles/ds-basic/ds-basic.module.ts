import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsBasicComponent } from './ds-basic.component';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule
  ],
  exports: [DsBasicComponent],
  declarations: [DsBasicComponent]
})
export class DsBasicModule { }
