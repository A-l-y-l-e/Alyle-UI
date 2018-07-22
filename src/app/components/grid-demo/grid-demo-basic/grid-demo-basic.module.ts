import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemoBasicComponent } from './grid-demo-basic.component';
import { LyCommonModule } from '@alyle/ui';
import { LayoutModule } from '@alyle/ui/layout';

@NgModule({
  imports: [
    CommonModule,
    LyCommonModule,
    LayoutModule
  ],
  declarations: [GridDemoBasicComponent],
  exports: [GridDemoBasicComponent]
})
export class GridDemoBasicModule { }
