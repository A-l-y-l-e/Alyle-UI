import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsDemoComponent } from './tabs-demo/tabs-demo.component';

const routes: Routes = [{path: '', component: TabsDemoComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsDemoRoutingModule { }
