import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';

const routes: Routes = [{ path: '', component: IconButtonDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconButtonDemoRoutingModule { }
