import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadioDemoComponent } from './radio-demo/radio-demo.component';

const routes: Routes = [{ path: '', component: RadioDemoComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadioDemoRoutingModule { }
