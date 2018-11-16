import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';
import { DynamicStylesComponent } from '@docs/customization/dynamic-styles/dynamic-styles.component';
import { InstallationComponent } from '@docs/getting-started/installation/installation.component';
import { GridDemoComponent } from '@docs/layout/grid-demo/grid-demo.component';
import { ButtonDemoComponent } from '@docs/components/button-demo/button-demo.component';
import { ToolbarDemoComponent } from '@docs/components/toolbar-demo/toolbar-demo.component';
import { ResizingCroppingImagesDemoComponent } from '@docs/components/resizing-cropping-images-demo/resizing-cropping-images-demo.component';
import { BadgeDemoComponent } from '@docs/components/badge-demo/badge-demo.component';
import { FieldDemoComponent } from '@docs/components/field-demo/field-demo.component';
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { ResponsiveDemoComponent } from './layout/responsive/responsive-demo.component';
import { SnackBarDemoComponent } from './components/snack-bar-demo/snack-bar-demo.component';

const routes: Routes = [
  /** layout */
  {
    path: 'layout',
    children: [
      { path: 'grid', component: GridDemoComponent },
      { path: 'responsive', component: ResponsiveDemoComponent },
      { path: 'tabs', component: TabsDemoComponent },
    ]
  },
  {
    path: 'customization',
    children: [
      { path: 'dynamic-styles', component: DynamicStylesComponent },
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
      { path: 'button', component: ButtonDemoComponent },
      { path: 'toolbar', component: ToolbarDemoComponent },
      { path: 'resizing-cropping-images', component: ResizingCroppingImagesDemoComponent },
      { path: 'badge', component: BadgeDemoComponent },
      { path: 'field', component: FieldDemoComponent },
      { path: 'checkbox', component: CheckboxDemoComponent },
      { path: 'snack-bar', component: SnackBarDemoComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class DocsRoutingModule { }
