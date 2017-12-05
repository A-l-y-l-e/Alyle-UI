import { NgModule } from '@angular/core';
import { LyDatePickerModule } from 'alyle-ui/date-picker';
import { CommonModule } from '@angular/common';
import { DatePickerDemo01Component } from './date-picker-demo-01.component';

@NgModule({
  imports: [
    CommonModule,
    LyDatePickerModule
  ],
  exports: [DatePickerDemo01Component],
  declarations: [DatePickerDemo01Component]
})
export class DatePickerDemo01Module { }
