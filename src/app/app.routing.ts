import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';
import { InstallationComponent } from '@docs/getting-started/installation/installation.component';

const routes: Routes = [
  /** Customization */
  { path: 'customization/theming', loadChildren: './components/theming/theming.module#ThemingModule' },
  { path: 'customization/multiple-themes', loadChildren: './components/multiple-themes/multiple-themes.module#MultipleThemesModule' },
  { path: 'customization/bg-color', loadChildren: './components/bg-color-demo/bg-color-demo.module#BgColorDemoModule' },
  /** Components */
  { path: 'components', loadChildren: './components/index#ComponentsModule' },
  { path: 'component', redirectTo: 'components' },
  { path: 'get-started/install', redirectTo: 'getting-started/installation' },
  { path: 'getting-started', redirectTo: 'getting-started/installation' },
  {
    path: 'getting-started',
    children: [
      {
        path: 'installation', component: InstallationComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forRoot(routes, {
      useHash: false,
      initialNavigation: 'enabled'
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
