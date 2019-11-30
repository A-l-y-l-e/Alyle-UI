import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';

@Component({
  template: ''
})
class EmptyComponent { }

const routes: Routes = [
  /** Pages */
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'api',
    children: [
      { path: ':package', component: ApiComponent, pathMatch: 'full' }
    ]
  },
  { path: 'component', redirectTo: 'components', pathMatch: 'full' },
  { path: 'components/resizing-cropping-images', redirectTo: 'components/image-cropper', pathMatch: 'full' },
  { path: '**', component: EmptyComponent }
];

@NgModule({
  declarations: [EmptyComponent],
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ]
})
export class AppRoutingModule { }
