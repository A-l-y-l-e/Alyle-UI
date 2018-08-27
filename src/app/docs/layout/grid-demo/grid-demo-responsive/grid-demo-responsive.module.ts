import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemoResponsiveComponent } from './grid-demo-responsive.component';
import { LyGridModule } from '@alyle/ui/grid';

@NgModule({
  imports: [
    CommonModule,
    LyGridModule
  ],
  declarations: [GridDemoResponsiveComponent],
  exports: [GridDemoResponsiveComponent]
})
export class GridDemoResponsiveModule { }
