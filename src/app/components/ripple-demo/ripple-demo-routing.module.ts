import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RippleDemoComponent } from './ripple-demo/ripple-demo.component';

const routes: Routes = [{ path: '', component: RippleDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RippleDemoRoutingModule { }
