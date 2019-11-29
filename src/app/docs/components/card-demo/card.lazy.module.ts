import { NgModule, Type } from '@angular/core';

import { CardDemoBasicComponent } from './card-demo-basic/card-demo-basic.component';
import { CardDemoBasicModule } from './card-demo-basic/card-demo-basic.module';

const elements = [
  CardDemoBasicComponent
];

@NgModule({
  imports: [
    CardDemoBasicModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
