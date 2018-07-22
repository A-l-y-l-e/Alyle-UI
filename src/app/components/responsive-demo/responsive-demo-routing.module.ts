import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponsiveDemoComponent } from './responsive-demo/responsive-demo.component';

const routes: Routes = [
  {
    path: 'layout/responsive',
    component: ResponsiveDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsiveDemoRoutingModule { }
