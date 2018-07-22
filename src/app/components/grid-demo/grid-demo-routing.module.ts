import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridDemoComponent } from './grid-demo.component';

const routes: Routes = [
  {
    path: 'layout/grid', component: GridDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridDemoRoutingModule { }
