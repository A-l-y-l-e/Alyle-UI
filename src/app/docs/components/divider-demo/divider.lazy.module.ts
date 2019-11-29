import { NgModule, Type } from '@angular/core';

import { ListDividersComponent } from './list-dividers/list-dividers.component';
import { InsetDividersComponent } from './inset-dividers/inset-dividers.component';
import { ListDividersModule } from './list-dividers/list-dividers.module';
import { InsetDividersModule } from './inset-dividers/inset-dividers.module';

const elements = [
  ListDividersComponent,
  InsetDividersComponent
];

@NgModule({
  imports: [
    ListDividersModule,
    InsetDividersModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
