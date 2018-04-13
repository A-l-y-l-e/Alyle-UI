import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShadowDemoRoutingModule } from './shadow-demo-routing.module';
import { ShadowDemoComponent } from './shadow-demo/shadow-demo.component';
import { DemoViewModule } from '../../demo-view';
import { ShadowDemo01Module } from './shadow-demo-01/shadow-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    ShadowDemoRoutingModule,
    DemoViewModule,
    ShadowDemo01Module
  ],
  declarations: [ShadowDemoComponent]
})
export class ShadowDemoModule { }
