import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatePickerDemoRoutingModule } from './date-picker-demo-routing.module';
import { DatePickerDemoComponent } from './date-picker-demo/date-picker-demo.component';
import { DemoViewModule } from './../../demo-view/demo-view.module';
import { DatePickerDemo01Module } from './date-picker-demo-01/date-picker-demo-01.module';

@NgModule({
  imports: [
    CommonModule,
    DemoViewModule,
    DatePickerDemo01Module,
    DatePickerDemoRoutingModule
  ],
  declarations: [DatePickerDemoComponent]
})
export class DatePickerDemoModule { }
