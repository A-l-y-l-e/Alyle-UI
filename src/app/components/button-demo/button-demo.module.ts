import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoViewModule } from '../../demo-view';
import { ButtonDemoRoutingModule } from './button-demo-routing.module';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { Example01Module } from './example-01/example-01.module';
import { Example02Module } from './example-02/example-02.module';

@NgModule({
  imports: [
    CommonModule,
    DemoViewModule,
    ButtonDemoRoutingModule,
    Example01Module,
    Example02Module
  ],
  declarations: [ButtonDemoComponent]
})
export class ButtonDemoModule { }
