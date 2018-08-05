import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsDemoComponent } from '@docs/layout/tabs-demo/tabs-demo.component';

const routes: Routes = [
  /** layout */
  {
    path: 'layout',
    children: [
      { path: 'tabs', component: TabsDemoComponent },
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
