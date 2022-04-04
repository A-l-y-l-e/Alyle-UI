import { NgModule, Type } from '@angular/core';

import { ListDividersComponent } from './list-dividers/list-dividers.component';
import { InsetDividersComponent } from './inset-dividers/inset-dividers.component';
import { ListDividersModule } from './list-dividers/list-dividers.module';
import { InsetDividersModule } from './inset-dividers/inset-dividers.module';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  ListDividersComponent,
  InsetDividersComponent
];

@NgModule({
  imports: [
    ListDividersModule,
    InsetDividersModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
