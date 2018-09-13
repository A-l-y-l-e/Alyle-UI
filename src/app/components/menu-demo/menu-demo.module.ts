import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule } from '@alyle/ui';

import { DemoViewModule } from '../../demo-view';
import { MenuDemo01Module } from './menu-demo-01/menu-demo-01.module';
import { MenuDemoComponent } from './menu-demo/menu-demo.component';
import { MenuDemoRoutingModule } from './menu-demo-routing.module';


@NgModule({
  imports: [
    CommonModule,
    MenuDemoRoutingModule,
    DemoViewModule,
    LyCommonModule,
    MenuDemo01Module
  ],
  declarations: [MenuDemoComponent]
})
export class MenuDemoModule { }
