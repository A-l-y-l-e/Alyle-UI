import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BgColorDemoComponent} from './bg-color-demo/bg-color-demo.component';

const routes: Routes = [{path: '', component: BgColorDemoComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BgColorDemoRoutingModule { }
