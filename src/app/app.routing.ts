import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'environments/environment';

const routes: Routes = [
  { path: 'get-started', loadChildren: './components/get-started/get-started.module#GetStartedModule' },
  { path: 'theming', loadChildren: './components/theming/theming.module#ThemingModule' },
  { path: 'multiple-themes', loadChildren: './components/multiple-themes/multiple-themes.module#MultipleThemesModule' },
  { path: 'component', loadChildren: './components/index#ComponentsModule' },
  { path: 'bg-color', loadChildren: './components/bg-color-demo/bg-color-demo.module#BgColorDemoModule' },
  { path: '', loadChildren: './home/home.module#HomeModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    initialNavigation: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
