import { NgModule, Type } from '@angular/core';

import { DrawerDemo01Module } from './drawer-demo-01/drawer-demo-01.module';
import { MiniDrawerModule } from './mini-drawer/mini-drawer.module';
import { DrawerDemo01Component } from './drawer-demo-01/drawer-demo-01.component';
import { MiniDrawerComponent } from './mini-drawer/mini-drawer.component';

const elements = [
  DrawerDemo01Component,
  MiniDrawerComponent
];

@NgModule({
  imports: [
    DrawerDemo01Module,
    MiniDrawerModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
