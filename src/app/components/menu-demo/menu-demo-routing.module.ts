import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuDemoComponent } from './menu-demo/menu-demo.component';

const routes: Routes = [{ path: '', component: MenuDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuDemoRoutingModule { }
