import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrawerDemoRoutingModule } from './drawer-demo-routing.module';
import { DrawerDemoComponent } from './drawer-demo/drawer-demo.component';
import { DemoViewModule } from '../../demo-view';
import { DrawerDemo01Module } from './drawer-demo-01/drawer-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    DrawerDemoRoutingModule,
    DemoViewModule,
    DrawerDemo01Module
  ],
  declarations: [DrawerDemoComponent]
})
export class DrawerDemoModule { }
