import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LyCommonModule } from '@alyle/ui';
import { LySkeletonModule } from '@alyle/ui/skeleton';

import { DocViewer } from './docs-viewer';
import { DemoViewModule } from '@app/demo-view';
import { ElementsLoader } from './elements-loader.service';
import { ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN, ELEMENT_MODULE_LOAD_CALLBACKS } from './element-registry';

const routes: Routes = [
  { path: '', component: DocViewer }
];

@NgModule({
  imports: [
    LyCommonModule,
    CommonModule,
    DemoViewModule,
    LySkeletonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ DocViewer ],
  exports: [ DocViewer ],
  providers: [
    ElementsLoader,
    {
      provide: ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN,
      useValue: ELEMENT_MODULE_LOAD_CALLBACKS
    },
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class DocViewerModule { }