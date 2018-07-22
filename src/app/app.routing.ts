import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'environments/environment';
import { HomeModule } from './home/home.module';

const routes: Routes = [
  /** Get Started */
  { path: 'get-started/install', loadChildren: './components/get-started/get-started.module#GetStartedModule' },
  /** Customization */
  { path: 'customization/theming', loadChildren: './components/theming/theming.module#ThemingModule' },
  { path: 'customization/multiple-themes', loadChildren: './components/multiple-themes/multiple-themes.module#MultipleThemesModule' },
  { path: 'customization/bg-color', loadChildren: './components/bg-color-demo/bg-color-demo.module#BgColorDemoModule' },
  /** Components */
  { path: 'components', loadChildren: './components/index#ComponentsModule' },
  { path: 'component', redirectTo: 'components' },
];

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forRoot(routes, {
      useHash: false,
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
