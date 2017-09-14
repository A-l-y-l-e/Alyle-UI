import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuDemoRoutingModule } from './menu-demo-routing.module';
import { DemoViewModule } from '../../demo-view';
import { MenuDemoComponent } from './menu-demo/menu-demo.component';
import { MenuExample01Module } from './menu-example-01/menu-example-01.module';

@NgModule({
  imports: [
    CommonModule,
    MenuDemoRoutingModule,
    DemoViewModule,
    MenuExample01Module
  ],
  declarations: [MenuDemoComponent]
})
export class MenuDemoModule { }
