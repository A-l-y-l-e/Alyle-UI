import { NgModule, Type } from '@angular/core';
import { MultipleThemesDemo01Module } from './multiple-themes/multiple-themes-demo-01/multiple-themes-demo-01.module';
import { MultipleThemesDemo01Component } from './multiple-themes/multiple-themes-demo-01/multiple-themes-demo-01.component';



const elements = [
  MultipleThemesDemo01Component
];

@NgModule({
  imports: [
    MultipleThemesDemo01Module
  ],
  entryComponents: elements
})
export class LazyModule {
  static entryComponents: Type<any>[] = elements;
}
