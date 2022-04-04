import { NgModule, Type } from '@angular/core';

import { BasicExpansionComponent } from './basic-expansion/basic-expansion.component';
import { CustomExpansionPanelComponent } from './custom-expansion-panel/custom-expansion-panel.component';
import { BasicExpansionModule } from './basic-expansion/basic-expansion.module';
import { CustomExpansionPanelModule } from './custom-expansion-panel/custom-expansion-panel.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  BasicExpansionComponent,
  CustomExpansionPanelComponent
];

@NgModule({
  imports: [
    BasicExpansionModule,
    CustomExpansionPanelModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
