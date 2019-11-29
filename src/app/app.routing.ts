import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ApiComponent } from './api/api.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  /** Pages */
  { path: '', component: HomeComponent },
  {
    path: 'api',
    children: [
      { path: ':package', component: ApiComponent, pathMatch: 'full' }
    ]
  },
  { path: 'component', redirectTo: 'components', pathMatch: 'full' },
  { path: 'components/resizing-cropping-images', redirectTo: 'components/image-cropper', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ]
})
export class AppRoutingModule { }
