import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultipleThemesComponent } from './multiple-themes.component';

const routes: Routes = [
  {
    path: '', component: MultipleThemesComponent,
    children: [
      {
        path: 'child-theme', loadChildren: './multiple-themes-demo-01/child-theme/child-theme.module#ChildLyCommonModule'
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultipleThemesRoutingModule { }
