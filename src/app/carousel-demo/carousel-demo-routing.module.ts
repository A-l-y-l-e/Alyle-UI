import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselDemoComponent } from './carousel-demo/carousel-demo.component';

const routes: Routes = [{ path: '', component: CarouselDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarouselDemoRoutingModule { }
