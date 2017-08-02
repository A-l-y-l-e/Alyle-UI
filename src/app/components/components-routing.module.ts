import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './components/components.component';

const routes: Routes = [
  { path: '', component: ComponentsComponent, children: [
    { path: 'button', loadChildren: '../button-demo/button-demo.module#ButtonDemoModule' },
    { path: 'input', loadChildren: '../input-demo/input-demo.module#InputDemoModule' },
    { path: 'tabs', loadChildren: '../tabs-demo/tabs-demo.module#TabsDemoModule' }
  ] },
  { path: '**',   redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
