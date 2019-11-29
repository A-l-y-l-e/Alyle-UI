import { NgModule, Type } from '@angular/core';

import { ResponsiveDemo01Module } from './responsive-demo-01/responsive-demo-01.module';
import { ResponsiveDemo01Component } from './responsive-demo-01/responsive-demo-01.component';
import { ResponsiveWithDsModule } from './responsive-with-ds/responsive-with-ds.module';
import { ResponsiveWithDsComponent } from './responsive-with-ds/responsive-with-ds.component';


const elements = [
  ResponsiveDemo01Component,
  ResponsiveWithDsComponent
];

@NgModule({
  imports: [
    ResponsiveDemo01Module,
    ResponsiveWithDsModule
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
