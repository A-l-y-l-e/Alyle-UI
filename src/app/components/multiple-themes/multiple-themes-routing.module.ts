import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultipleThemesComponent } from './multiple-themes.component';

const routes: Routes = [
  {
    path: '', component: MultipleThemesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultipleThemesRoutingModule { }
