import { NgModule, Type } from '@angular/core';

import { BasicExpansionComponent } from './basic-expansion/basic-expansion.component';
import { CustomExpansionPanelComponent } from './custom-expansion-panel/custom-expansion-panel.component';
import { BasicExpansionModule } from './basic-expansion/basic-expansion.module';
import { CustomExpansionPanelModule } from './custom-expansion-panel/custom-expansion-panel.module';

const elements = [
  BasicExpansionComponent,
  CustomExpansionPanelComponent
];

@NgModule({
  imports: [
    BasicExpansionModule,
    CustomExpansionPanelModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
