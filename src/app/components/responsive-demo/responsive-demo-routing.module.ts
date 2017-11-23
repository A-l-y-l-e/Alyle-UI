import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponsiveDemoComponent } from './responsive-demo/responsive-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ResponsiveDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsiveDemoRoutingModule { }
