import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CardDemoComponent } from './docs/components/card-demo/card-demo.component';
import { TypographyDemoComponent } from './docs/components/typography-demo/typography-demo.component';
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
  /** Components */
  {
    path: 'components',
    children: [
      { path: 'card', component: CardDemoComponent },
      { path: 'typography', component: TypographyDemoComponent },
    ]
  },
  { path: 'component', redirectTo: 'components', pathMatch: 'full' },
  { path: 'get-started/install', redirectTo: 'getting-started/installation', pathMatch: 'full' },
  { path: 'getting-started', redirectTo: 'getting-started/installation', pathMatch: 'full' },
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
