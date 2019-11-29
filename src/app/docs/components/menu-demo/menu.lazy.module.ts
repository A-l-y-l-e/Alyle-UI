import { NgModule, Type } from '@angular/core';

import { MenuDemo01Component } from './menu-demo-01/menu-demo-01.component';
import { MenuDemo01Module } from './menu-demo-01/menu-demo-01.module';

const elements = [
  MenuDemo01Component
];

@NgModule({
  imports: [
    MenuDemo01Module
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
