import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';
import { DynamicStylesComponent } from '@docs/customization/dynamic-styles/dynamic-styles.component';

const routes: Routes = [
  /** layout */
  {
    path: 'layout',
    children: [
      { path: 'tabs', component: TabsDemoComponent },
    ]
  },
  {
    path: 'customization',
    children: [
      { path: 'dynamic-styles', component: DynamicStylesComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DocsRoutingModule { }
