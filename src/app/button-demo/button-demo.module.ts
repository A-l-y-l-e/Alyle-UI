import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoViewModule } from '../demo-view';
import { ButtonDemoRoutingModule } from './button-demo-routing.module';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { Example01Module } from './example-01/example-01.module';
import { Example02Module } from './example-02/example-02.module';
import { ButtonExample03Module } from './button-example-03/button-example-03.module';
import { ButtonExample04Module } from './button-example-04/button-example-04.module';

@NgModule({
  imports: [
    CommonModule,
    DemoViewModule,
    ButtonDemoRoutingModule,
    Example01Module,
    Example02Module,
    ButtonExample03Module,
    ButtonExample04Module
  ],
  declarations: [ButtonDemoComponent]
})
export class ButtonDemoModule { }
