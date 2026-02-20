import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core';

@Component({
  template: '',
  standalone: true
})
export class EmptyComponent { }

export const routes: Routes = [
  /** Pages */
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'api',
    loadChildren: () => import('./api/api.module').then(mod => mod.ApiModule)
  },

  { path: 'components/resizing-cropping-images', redirectTo: 'components/image-cropper', pathMatch: 'full' },
  { path: '**', component: EmptyComponent }
];