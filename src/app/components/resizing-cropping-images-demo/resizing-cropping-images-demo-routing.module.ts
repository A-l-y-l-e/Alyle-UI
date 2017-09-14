import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResizingCroppingImagesDemoComponent } from './resizing-cropping-images-demo/resizing-cropping-images-demo.component';

const routes: Routes = [{ path: '', component: ResizingCroppingImagesDemoComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResizingCroppingImagesDemoRoutingModule { }
