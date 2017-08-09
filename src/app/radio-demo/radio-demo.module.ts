import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadioDemoRoutingModule } from './radio-demo-routing.module';
import { DemoViewModule } from '../demo-view';
import { RadioDemoComponent } from './radio-demo/radio-demo.component';
import { RadioExample01Module } from './radio-example-01/radio-example-01.module';

@NgModule({
  imports: [
    CommonModule,
    RadioDemoRoutingModule,
    DemoViewModule,
    RadioExample01Module
  ],
  declarations: [RadioDemoComponent]
})
export class RadioDemoModule { }
