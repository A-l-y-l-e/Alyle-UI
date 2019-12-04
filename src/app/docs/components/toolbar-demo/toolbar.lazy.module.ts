import { NgModule, Type } from '@angular/core';

import { ToolbarBasicDemoComponent } from './toolbar-basic-demo/toolbar-basic-demo.component';
import { ToolbarWithIconsComponent } from './toolbar-with-icons/toolbar-with-icons.component';
import { ToolbarDenseComponent } from './toolbar-dense/toolbar-dense.component';
import { ToolbarBasicDemoModule } from './toolbar-basic-demo/toolbar-basic-demo.module';
import { ToolbarWithIconsModule } from './toolbar-with-icons/toolbar-with-icons.module';
import { ToolbarDenseModule } from './toolbar-dense/toolbar-dense.module';

const elements = [
  ToolbarBasicDemoComponent,
  ToolbarWithIconsComponent,
  ToolbarDenseComponent
];

@NgModule({
  imports: [
    ToolbarBasicDemoModule,
    ToolbarWithIconsModule,
    ToolbarDenseModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
