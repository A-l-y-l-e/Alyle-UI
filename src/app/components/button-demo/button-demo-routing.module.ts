import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ButtonDemoComponent } from './button-demo/button-demo.component';

const routes: Routes = [{ path: '', component: ButtonDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonDemoRoutingModule { }
