import { NgModule, Type } from '@angular/core';

import { MenuDemo01Component } from './menu-demo-01/menu-demo-01.component';
import { MenuDemo01Module } from './menu-demo-01/menu-demo-01.module';
import { MenuPlaygroundComponent } from './menu-playground/menu-playground.component';
import { MenuPlaygroundModule } from './menu-playground/menu-playground.module';

const entryComponents = [
  MenuDemo01Component,
  MenuPlaygroundComponent
];

@NgModule({
  imports: [
    MenuDemo01Module,
    MenuPlaygroundModule
  ],
  entryComponents
})
export class LazyModule {
  static entryComponents: Type<any>[] = entryComponents;
}
