import { NgModule, Type } from '@angular/core';

import { DrawerDemo01Module } from './drawer-demo-01/drawer-demo-01.module';
import { MiniDrawerModule } from './mini-drawer/mini-drawer.module';
import { DrawerDemo01Component } from './drawer-demo-01/drawer-demo-01.component';
import { MiniDrawerComponent } from './mini-drawer/mini-drawer.component';
import { WithCustomElementComponent } from '@app/docs/element-registry';

const elements = [
  DrawerDemo01Component,
  MiniDrawerComponent
];

@NgModule({
  imports: [
    DrawerDemo01Module,
    MiniDrawerModule
  ]
})
export class LazyModule implements WithCustomElementComponent {
  customElementComponents: Type<any>[] = elements;
}
