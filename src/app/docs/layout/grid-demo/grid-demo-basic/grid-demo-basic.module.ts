import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemoBasicComponent } from './grid-demo-basic.component';
import { LyCommonModule } from '@alyle/ui';
import { LyGridModule } from '@alyle/ui/grid';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LyGridModule
  ],
  declarations: [GridDemoBasicComponent],
  exports: [GridDemoBasicComponent]
})
export class GridDemoBasicModule { }
