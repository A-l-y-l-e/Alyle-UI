import { NgModule, Type } from '@angular/core';

import { IconsComponent } from './icons/icons.component';
import { IconsModule } from './icons/icons.module';

const elements = [
  IconsComponent
];

@NgModule({
  imports: [
    IconsModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
