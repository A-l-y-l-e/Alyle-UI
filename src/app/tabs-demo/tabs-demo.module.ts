import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoViewModule } from '../demo-view';
import { TabsDemoRoutingModule } from './tabs-demo-routing.module';
import { TabsDemoComponent } from './tabs-demo/tabs-demo.component';
import { TabsExample01Module } from './tabs-example-01/tabs-example-01.module';
import { TabsExample02Module } from './tabs-example-02/tabs-example-02.module';
import { TabsExample03Module } from './tabs-example-03/tabs-example-03.module';

@NgModule({
  imports: [
    CommonModule,
    TabsDemoRoutingModule,
    DemoViewModule,
    TabsExample01Module,
    TabsExample02Module,
    TabsExample03Module
  ],
  declarations: [TabsDemoComponent]
})
export class TabsDemoModule { }
