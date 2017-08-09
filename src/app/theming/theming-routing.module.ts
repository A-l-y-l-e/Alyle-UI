import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThemingComponent } from './theming/theming.component';

const routes: Routes = [{ path: '', component: ThemingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemingRoutingModule { }
