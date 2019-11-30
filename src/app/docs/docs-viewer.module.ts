import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

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
    HttpClientModule,
    DemoViewModule,
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
