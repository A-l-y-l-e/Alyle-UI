import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShadowDemoComponent } from './shadow-demo/shadow-demo.component';

const routes: Routes = [
  { path: '', component: ShadowDemoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShadowDemoRoutingModule { }
