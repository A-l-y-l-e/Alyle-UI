import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CardDemoComponent } from '@docs/components/card-demo/card-demo.component';
import { TypographyDemoComponent } from '@docs/components/typography-demo/typography-demo.component';
import { MultipleThemesComponent } from './components/multiple-themes/multiple-themes.component';
import { ThemingComponent } from '@docs/customization/theming/theming.component';
import { ApiComponent } from './api/api.component';

const routes: Routes = [
  /** Pages */
  { path: '', component: HomeComponent },
  /** Customization */
  { path: 'customization/multiple-themes', component: MultipleThemesComponent },
  { path: 'customization/bg-color', loadChildren: './components/bg-color-demo/bg-color-demo.module#BgColorDemoModule' },
  {
    path: 'customization',
    children: [
      { path: 'theming', component: ThemingComponent }
    ]
  },
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
      { path: 'drawer', loadChildren: './components/drawer-demo/drawer-demo.module#DrawerDemoModule' },
      { path: 'radio', loadChildren: './components/radio-demo/radio-demo.module#RadioDemoModule' },
      { path: 'menu', loadChildren: './components/menu-demo/menu-demo.module#MenuDemoModule' },
      { path: 'carousel', loadChildren: './components/carousel-demo/carousel-demo.module#CarouselDemoModule' },
      { path: 'icon-button', loadChildren: './components/icon-button-demo/icon-button-demo.module#IconButtonDemoModule' },
      { path: 'ripple', loadChildren: './components/ripple-demo/ripple-demo.module#RippleDemoModule' },
      { path: 'shadow', loadChildren: './components/shadow-demo/shadow-demo.module#ShadowDemoModule' },
      { path: 'card', component: CardDemoComponent },
      { path: 'typography', component: TypographyDemoComponent },
    ]
  },
  { path: 'component', redirectTo: 'components' },
  { path: 'get-started/install', redirectTo: 'getting-started/installation' },
  { path: 'getting-started', redirectTo: 'getting-started/installation' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
