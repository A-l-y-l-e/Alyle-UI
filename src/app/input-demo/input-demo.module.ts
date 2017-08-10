import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoViewModule } from '../demo-view';
import { InputDemoRoutingModule } from './input-demo-routing.module';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { InputDemoExample01Module } from './input-demo-example-01/input-demo-example-01.module';
import { InputDemoExample02Module } from './input-demo-example-02/input-demo-example-02.module';
import { InputDemoExample03Module } from './input-demo-example-03/input-demo-example-03.module';
import { InputExample04Module } from './input-example-04/input-example-04.module';
import { InputExample05Module } from './input-example-05/input-example-05.module';

@NgModule({
  imports: [
    CommonModule,
    DemoViewModule,
    InputDemoRoutingModule,
    InputDemoExample01Module,
    InputDemoExample02Module,
    InputDemoExample03Module,
    InputExample04Module,
    InputExample05Module
  ],
  declarations: [InputDemoComponent]
})
export class InputDemoModule { }
