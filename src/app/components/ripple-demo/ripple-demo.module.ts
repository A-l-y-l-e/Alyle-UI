import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RippleDemoRoutingModule } from './ripple-demo-routing.module';
import { RippleDemoComponent } from './ripple-demo/ripple-demo.component';
import { DemoViewModule } from '../../demo-view';
import { RippleDemo01Module } from './ripple-demo-01/ripple-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    RippleDemoRoutingModule,
    DemoViewModule,
    RippleDemo01Module
  ],
  declarations: [RippleDemoComponent]
})
export class RippleDemoModule { }
