import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuDemoRoutingModule } from './menu-demo-routing.module';
import { DemoViewModule } from '../../demo-view';
import { MenuDemoComponent } from './menu-demo/menu-demo.component';
import { MenuExample01Module } from './menu-example-01/menu-example-01.module';
import { MenuDemo01Module } from './menu-demo-01/menu-demo-01.module';
import { MenuDemo02Module } from './menu-demo-02/menu-demo-02.module';
import { LyCommonModule } from '@alyle/ui';

@NgModule({
  imports: [
    CommonModule,
    MenuDemoRoutingModule,
    DemoViewModule,
    LyCommonModule,
    MenuExample01Module,
    MenuDemo01Module,
    MenuDemo02Module
  ],
  declarations: [MenuDemoComponent]
})
export class MenuDemoModule { }
