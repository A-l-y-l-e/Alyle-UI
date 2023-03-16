import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
  template: ''
})
export class EmptyComponent { }

const routes: Routes = [
  /** Pages */
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'api',
    loadChildren: () => import('./api/api.module').then(mod => mod.ApiModule)
  },

  { path: 'component', redirectTo: 'components', pathMatch: 'full' },
  { path: 'components/resizing-cropping-images', redirectTo: 'components/image-cropper', pathMatch: 'full' },
  { path: '**', component: EmptyComponent }
];

@NgModule({
  declarations: [EmptyComponent],
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled'
    })
  ]
})
export class AppRoutingModule { }
