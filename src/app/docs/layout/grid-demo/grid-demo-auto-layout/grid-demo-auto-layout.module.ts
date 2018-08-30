import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyGridModule } from '@alyle/ui/grid';
import { GridDemoAutoLayoutComponent } from './grid-demo-auto-layout.component';

@NgModule({
  imports: [
    CommonModule,
    LyGridModule
  ],
  exports: [GridDemoAutoLayoutComponent],
  declarations: [GridDemoAutoLayoutComponent]
})
export class GridDemoAutoLayoutModule { }
