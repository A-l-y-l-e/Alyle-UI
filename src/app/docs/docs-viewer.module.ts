import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LySkeletonModule } from '@alyle/ui/skeleton';

import { DocViewer } from './docs-viewer';
import { DemoViewModule } from '@app/demo-view';
import { ViewComponent } from '@app/demo-view/view/view.component';
import { ElementsLoader } from './elements-loader.service';
import { ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN, ELEMENT_MODULE_LOAD_CALLBACKS } from './element-registry';

const routes: Routes = [
  { path: '', component: DocViewer }
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DemoViewModule,
    LySkeletonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DocViewer],
  entryComponents: [ViewComponent],
  exports: [DocViewer],
  providers: [
    ElementsLoader,
    {
      provide: ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN,
      useValue: ELEMENT_MODULE_LOAD_CALLBACKS
    }
  ]
})
export class DocViewerModule { }
