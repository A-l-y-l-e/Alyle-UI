import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatePickerDemoComponent } from './date-picker-demo/date-picker-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DatePickerDemoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatePickerDemoRoutingModule { }
