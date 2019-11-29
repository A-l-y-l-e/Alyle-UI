import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DocViewer } from './docs-viewer';
import { DemoViewModule } from '@app/demo-view';
import { ViewComponent } from '@app/demo-view/view/view.component';

@NgModule({
  imports: [
    HttpClientModule,
    DemoViewModule
  ],
  declarations: [DocViewer],
  exports: [DocViewer],
  entryComponents: [ViewComponent]
})
export class DocViewerModule { }
