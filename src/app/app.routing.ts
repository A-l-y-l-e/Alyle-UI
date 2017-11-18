import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'environments/environment';

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomeModule' },
  { path: 'get-started', loadChildren: './components/get-started/get-started.module#GetStartedModule' },
  { path: 'theming', loadChildren: './components/theming/theming.module#ThemingModule' },
  { path: 'components', loadChildren: './components/index#ComponentsModule' },
  { path: 'bg-color', loadChildren: './components/bg-color-demo/bg-color-demo.module#BgColorDemoModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: !environment.production })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
