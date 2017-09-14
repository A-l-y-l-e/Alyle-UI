import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BgColorDemoRoutingModule } from './bg-color-demo-routing.module';
import { DemoViewModule } from '../../demo-view';
import { BgColorDemoComponent } from './bg-color-demo/bg-color-demo.component';
import { BgColorDemo01Module } from './bg-color-demo-01/bg-color-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    BgColorDemoRoutingModule,
    DemoViewModule,
    BgColorDemo01Module
  ],
  declarations: [BgColorDemoComponent]
})
export class BgColorDemoModule { }
