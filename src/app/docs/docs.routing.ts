import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';
import { DynamicStylesComponent } from '@docs/customization/dynamic-styles/dynamic-styles.component';
import { InstallationComponent } from '@docs/getting-started/installation/installation.component';
import { GridDemoComponent } from '@docs/layout/grid-demo/grid-demo.component';
import { ButtonDemoComponent } from '@docs/components/button-demo/button-demo.component';

const routes: Routes = [
  /** layout */
  {
    path: 'layout',
    children: [
      { path: 'grid', component: GridDemoComponent },
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
