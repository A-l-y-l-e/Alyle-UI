import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemoResponsiveComponent } from './grid-demo-responsive.component';
import { LayoutModule } from '@alyle/ui/layout';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule
  ],
  declarations: [GridDemoResponsiveComponent],
  exports: [GridDemoResponsiveComponent]
})
export class GridDemoResponsiveModule { }
