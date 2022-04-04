import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '@app/docs/element-registry';

import { CardDemoBasicComponent } from './card-demo-basic/card-demo-basic.component';
import { CardDemoBasicModule } from './card-demo-basic/card-demo-basic.module';

const elements = [
  CardDemoBasicComponent
];

@NgModule({
  imports: [
    CardDemoBasicModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
