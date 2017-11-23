import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsiveDemoRoutingModule } from './responsive-demo-routing.module';
import { ResponsiveDemoComponent } from './responsive-demo/responsive-demo.component';
import { DemoViewModule } from '../../demo-view/demo-view.module';
import { ResponsiveDemo01Module } from './responsive-demo-01/responsive-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    DemoViewModule,
    ResponsiveDemo01Module,
    ResponsiveDemoRoutingModule
  ],
  declarations: [ResponsiveDemoComponent]
})
export class ResponsiveDemoModule { }
