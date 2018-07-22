import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './components/components.component';

const routes: Routes = [
  { path: '', component: ComponentsComponent, children: [
    { path: 'button', loadChildren: './button-demo/button-demo.module#ButtonDemoModule' },
    { path: 'drawer', loadChildren: './drawer-demo/drawer-demo.module#DrawerDemoModule' },
    { path: 'input', loadChildren: './input-demo/input-demo.module#InputDemoModule' },
    { path: 'tabs', loadChildren: './tabs-demo/tabs-demo.module#TabsDemoModule' },
    { path: 'radio', loadChildren: './radio-demo/radio-demo.module#RadioDemoModule' },
    { path: 'menu', loadChildren: './menu-demo/menu-demo.module#MenuDemoModule' },
    { path: 'resizing-cropping-images', loadChildren: './resizing-cropping-images-demo/resizing-cropping-images-demo.module#ResizingCroppingImagesDemoModule' },
    { path: 'carousel', loadChildren: './carousel-demo/carousel-demo.module#CarouselDemoModule' },
    { path: 'icon-button', loadChildren: './icon-button-demo/icon-button-demo.module#IconButtonDemoModule' },
    { path: 'ripple', loadChildren: './ripple-demo/ripple-demo.module#RippleDemoModule' },
    // { path: 'date-picker', loadChildren: './date-picker-demo/date-picker-demo.module#DatePickerDemoModule' } Beta
    { path: 'shadow', loadChildren: './shadow-demo/shadow-demo.module#ShadowDemoModule' },
  ] },
  { path: '**',   redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
