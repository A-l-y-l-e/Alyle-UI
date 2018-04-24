import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildThemeComponent } from './child-theme.component';

const routes: Routes = [
  {
    path: '', component: ChildThemeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildThemeRoutingModule { }
