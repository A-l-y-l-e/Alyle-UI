import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsDemoComponent } from './layout/tabs-demo/tabs-demo.component';
import { DynamicStylesComponent } from './customization/dynamic-styles/dynamic-styles.component';
import { InstallationComponent } from './getting-started/installation/installation.component';
import { GridDemoComponent } from './layout/grid-demo/grid-demo.component';
import { ButtonDemoComponent } from './components/button-demo/button-demo.component';
import { ToolbarDemoComponent } from './components/toolbar-demo/toolbar-demo.component';
import { ResizingCroppingImagesDemoComponent } from './components/resizing-cropping-images-demo/resizing-cropping-images-demo.component';
import { BadgeDemoComponent } from './components/badge-demo/badge-demo.component';
import { FieldDemoComponent } from './components/field-demo/field-demo.component';
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { ResponsiveDemoComponent } from './layout/responsive/responsive-demo.component';
import { SnackBarDemoComponent } from './components/snack-bar-demo/snack-bar-demo.component';
import { PaperDemoComponent } from './customization/paper-demo/paper-demo.component';
import { IconDemoComponent } from './components/icon-demo/icon-demo.component';
import { TooltipDemoComponent } from './components/tooltip-demo/tooltip-demo.component';
import { MenuDemoComponent } from './components/menu-demo/menu-demo.component';
import { AvatarDemoComponent } from './components/avatar-demo/avatar-demo.component';
import { ListDemoComponent } from './components/list-demo/list-demo.component';
import { DividerDemoComponent } from './components/divider-demo/divider-demo.component';
import { DrawerDemoComponent } from './components/drawer-demo/drawer-demo.component';
import { RadioDemoComponent } from './components/radio-demo/radio-demo.component';
import { SelectDemoComponent } from './components/select-demo/select-demo.component';
import { DialogDemoComponent } from './components/dialog-demo/dialog-demo.component';
import { CarouselDemoComponent } from './components/carousel-demo/carousel-demo.component';
import { ExpansionDemoComponent } from './components/expansion-demo/expansion-demo.component';
import { ThemingComponentsComponent } from './customization/theming-components/theming-components.component';
import { LazyLoadingComponent } from './guides/lazy-loading/lazy-loading.component';
import { ThemingComponent } from './customization/theming/theming.component';
import { MultipleThemesComponent } from '@app/components/multiple-themes/multiple-themes.component';

const routes: Routes = [
  {
    path: 'customization',
    children: [
      { path: 'dynamic-styles', component: DynamicStylesComponent },
      { path: 'paper', component: PaperDemoComponent },
      { path: 'theming-components', component: ThemingComponentsComponent },
      { path: 'theming', component: ThemingComponent },
      { path: 'multiple-themes', component: MultipleThemesComponent }
    ]
  },
  {
    path: 'getting-started',
    children: [
      { path: 'installation', component: InstallationComponent }
    ]
  },
  {
    path: 'components',
    children: [
      { path: 'grid', component: GridDemoComponent },
      { path: 'responsive', component: ResponsiveDemoComponent },
      { path: 'tabs', component: TabsDemoComponent },
      { path: 'button', component: ButtonDemoComponent },
      { path: 'toolbar', component: ToolbarDemoComponent },
      { path: 'resizing-cropping-images', component: ResizingCroppingImagesDemoComponent },
      { path: 'badge', component: BadgeDemoComponent },
      { path: 'field', component: FieldDemoComponent },
      { path: 'checkbox', component: CheckboxDemoComponent },
      { path: 'snack-bar', component: SnackBarDemoComponent },
      { path: 'icon', component: IconDemoComponent },
      { path: 'tooltip', component: TooltipDemoComponent },
      { path: 'menu', component: MenuDemoComponent },
      { path: 'avatar', component: AvatarDemoComponent },
      { path: 'list', component: ListDemoComponent },
      { path: 'divider', component: DividerDemoComponent },
      { path: 'drawer', component: DrawerDemoComponent },
      { path: 'radio', component: RadioDemoComponent },
      { path: 'select', component: SelectDemoComponent },
      { path: 'dialog', component: DialogDemoComponent },
      { path: 'carousel', component: CarouselDemoComponent },
      { path: 'expansion', component: ExpansionDemoComponent }
    ]
  },
  {
    path: 'guides',
    children: [
      { path: 'lazy-loading', component: LazyLoadingComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class DocsRoutingModule { }
