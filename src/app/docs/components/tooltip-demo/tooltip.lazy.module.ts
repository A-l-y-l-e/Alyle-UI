import { NgModule, Type } from '@angular/core';
import { BasicTooltipComponent } from './basic-tooltip/basic-tooltip.component';
import { BasicTooltipModule } from './basic-tooltip/basic-tooltip.module';


const elements = [
  BasicTooltipComponent
];

@NgModule({
  imports: [
    BasicTooltipModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
