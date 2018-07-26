import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';
import { InstallationComponent } from '@docs/getting-started/installation/installation.component';
import { CardDemoComponent } from '@docs/components/card-demo/card-demo.component';
import { TypographyDemoComponent } from '@docs/components/typography-demo/typography-demo.component';

const routes: Routes = [
  /** Customization */
  { path: 'customization/theming', loadChildren: './components/theming/theming.module#ThemingModule' },
  { path: 'customization/multiple-themes', loadChildren: './components/multiple-themes/multiple-themes.module#MultipleThemesModule' },
  { path: 'customization/bg-color', loadChildren: './components/bg-color-demo/bg-color-demo.module#BgColorDemoModule' },
  /** Components */
  {
    path: 'components',
    children: [
      { path: 'button', loadChildren: './components/button-demo/button-demo.module#ButtonDemoModule' },
      { path: 'drawer', loadChildren: './components/drawer-demo/drawer-demo.module#DrawerDemoModule' },
      { path: 'input', loadChildren: './components/input-demo/input-demo.module#InputDemoModule' },
      { path: 'tabs', loadChildren: './components/tabs-demo/tabs-demo.module#TabsDemoModule' },
      { path: 'radio', loadChildren: './components/radio-demo/radio-demo.module#RadioDemoModule' },
      { path: 'menu', loadChildren: './components/menu-demo/menu-demo.module#MenuDemoModule' },
      { path: 'resizing-cropping-images', loadChildren: './components/resizing-cropping-images-demo/resizing-cropping-images-demo.module#ResizingCroppingImagesDemoModule' },
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
