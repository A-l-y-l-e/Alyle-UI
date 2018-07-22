import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridDemoRoutingModule } from './grid-demo-routing.module';
import { GridDemoComponent } from './grid-demo.component';
import { DemoViewModule } from '../../demo-view';
import { GridDemoBasicModule } from './grid-demo-basic/grid-demo-basic.module';
import { GridDemoResponsiveModule } from './grid-demo-responsive/grid-demo-responsive.module';

@NgModule({
  imports: [
    CommonModule,
    DemoViewModule,
    GridDemoRoutingModule,
    GridDemoBasicModule,
    GridDemoResponsiveModule
  ],
  declarations: [GridDemoComponent]
})
export class GridDemoModule { }
