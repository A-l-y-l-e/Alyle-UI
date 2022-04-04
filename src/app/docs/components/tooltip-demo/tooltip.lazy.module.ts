import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '@app/docs/element-registry';
import { BasicTooltipComponent } from './basic-tooltip/basic-tooltip.component';
import { BasicTooltipModule } from './basic-tooltip/basic-tooltip.module';


const elements = [
  BasicTooltipComponent
];

@NgModule({
  imports: [
    BasicTooltipModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
